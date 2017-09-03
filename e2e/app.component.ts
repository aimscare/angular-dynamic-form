import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl, FormBuilder, Validators } from '@angular/forms';

import {Message,SelectItem} from 'primeng/primeng';
import {CountryService} from './../service/country-service';
import {Country,Customer,IRule} from './../service/interfaces';

import * as _ from 'underscore';
import * as _s from 'underscore.string';




@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

public myForm: FormGroup;

countries: SelectItem[];

countrycodes: SelectItem[];

selectedCountry: any;

selectedCountries: string[] = [];

activeIndex: number = 0;


questions: any[];

options: SelectItem[];

criteriaCount:number=0;

createMode:boolean=false;
disableSubmitButton:boolean=true;

rule:IRule;

    constructor(private _fb: FormBuilder,private countryService: CountryService) {

    }


    ngOnInit() {


      this.myForm = this._fb.group({
          ruleCriterias: this._fb.array([])
      });

      this.countryService.getRule().subscribe((rule:IRule) =>{
        //  console.log("Service output=["+JSON.stringify(rule)+"]");
          this.rule=rule;
          this.generateRule(rule);
          //this.initRuleCriteriaCreateMode1();
          if(this.createMode){
            this.initRuleCriteriaModifyMode(this.rule);
          }
          else {
            this.initRuleCriteria();
          }
      });


    }


    initRuleCriteria() {
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      let newGroup = this._fb.group({
          question: ['', Validators.required],
          questions:[]
        });
        //arrayControl.controls[0].setValue('questions',this.questions)
        var ctrlsSize=arrayControl.controls.length;     
        arrayControl.push(newGroup); 
    }

    initRuleCriteriaModifyMode(rule:IRule) {

      console.log("CriteriaCount initRuleCriteria1=["+this.criteriaCount+"]");

      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];

      rule.ruleCriteria.selections.forEach(question => {

            let newGroup = this._fb.group({
                question: [{questionId: question.selectedQuestionId,questionText:question.selectedQuestionText}, Validators.required]
            });
              arrayControl.push(newGroup);

      });


    }

    enableSubmit(){

    }

    addRuleCriteria() {


      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];

      var status=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
       return formgroup.status=='INVALID';
      })
      if(status){
        return
      }


      var ids = [];


      arrayControl.controls.forEach(formgroup =>{
        console.log("value=["+JSON.stringify(formgroup.value)+"]");
        //ids.push(formgroup.value);
        ids.push(_.pluck(formgroup.value,'questionId'));
      });

      var filtered=[];
      this.questions.forEach(question =>{
        ids.forEach( id =>{
          if(id!=question.value.questionId){
            filtered.push(question);
          }
        });

      });
      this.questions=filtered;
      this.questions.forEach(selectItem =>{
        console.log("After Removed=["+JSON.stringify(selectItem.value)+"]");
      });

      console.log("addRuleCriteria:array length=["+arrayControl.controls.length+"]");
      if(arrayControl.controls.length < this.criteriaCount){
        this.initRuleCriteria();
      }

     }

    removeRuleCriteria(i: number) {
        const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        arrayControl.removeAt(i);
    }

    save(model: Customer) {
        // call API to save
        // ...
        console.log(model);
    }

    addRuleCriteriaCreateMode() {
      let rule=this.rule;
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      _.each(rule.ruleCriteria.selections,function(selection){
          let newGroup = this._fb.group({
              question: [selection.selectedQuestionId, Validators.required]
          });
          arrayControl.push(newGroup);
      });

    }


    generateRule(rule:IRule){
      let questions: any[] = [];
      let options: any[] = [];
      this.criteriaCount=rule.ruleCriteria.selections.length;
      console.log("CriteriaCount=["+this.criteriaCount+"]");

      _.each(rule.ruleCriteria.questionList,function(question){
            //console.log("Question=["+JSON.stringify(question)+"]");
            questions.push({label: question.questionText, value: {questionText: question.questionText, questionId: question.questionId}});

      });
      // for (let criteria of rule.ruleCriteria) {
      //
      //   for
      //     questions.push({label: question.questionText, value: {questionText: question.questionText, questionId: question.questionId}});
      //     for(let option of question.options) {
      //       options.push({label: option.optionText, value: {optionId: option.optionId, optionText: option.optionText}});
      //     }
      //
      // }

      this.options=options;
      this.questions=rule.ruleCriteria.questionList;
      //this.questions=questions;


    }




}
