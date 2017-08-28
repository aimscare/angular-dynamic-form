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
})
export class AppComponent implements OnInit {

public myForm: FormGroup;

countries: SelectItem[];

countrycodes: SelectItem[];

selectedCountry: any;

selectedCountries: string[] = [];

activeIndex: number = 0;

questions: SelectItem[];

options: SelectItem[];

criteriaCount:number=0;

createMode:boolean=false;
disableSubmitButton:boolean=true;

rule:IRule;

    constructor(private _fb: FormBuilder,private countryService: CountryService) {

    }


    ngOnInit() {


      this.myForm = this._fb.group({
          name: ['', [Validators.required, Validators.minLength(5)]],
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
        });
        arrayControl.push(newGroup); ;
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
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        console.log("addRuleCriteria:array length=["+arrayControl.controls.length+"]");
        console.log("enableSubmit disableSubmit1=["+this.disableSubmitButton+"]");
        this.disableSubmitButton=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
           return formgroup.status=='INVALID';
         })
        console.log("enableSubmit disableSubmit2=["+this.disableSubmitButton+"]");
    }

    addRuleCriteria() {


      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];

      var status=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
       return formgroup.status=='INVALID';
      })
      if(status){
        return
      }

      arrayControl.controls.forEach(formgroup =>{
        console.log(formgroup.value+"value=["+JSON.stringify(formgroup.value)+"]");
        var index = this.questions.indexOf(formgroup.value);
        this.questions.splice(index, 1);
        //this.questions.remove(formgroup.value)

      });

      console.log("addRuleCriteria:array length=["+arrayControl.controls.length+"]");
      if(arrayControl.controls.length < this.criteriaCount){
        this.initRuleCriteria();
      }

      console.log("addRuleCriteria disableSubmit1=["+this.disableSubmitButton+"]");
      this.disableSubmitButton=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
       return formgroup.status=='INVALID';
     })
     console.log("addRuleCriteria disableSubmit2=["+this.disableSubmitButton+"]");



     }

    removeRuleCriteria(i: number) {

        const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        arrayControl.removeAt(i);

        console.log("removeRuleCriteria disableSubmit1=["+this.disableSubmitButton+"]");

        this.disableSubmitButton=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
         return formgroup.status=='INVALID';
       })
        console.log("removeRuleCriteria disableSubmit2=["+this.disableSubmitButton+"]");
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
      this.questions=questions;
      //console.log("generateRule=["+this.questions+"]");
      //console.log(this.options);
    }




}
