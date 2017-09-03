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

    additions :number=0;

    questionOptions(j:number,arrayControl:any): any[] {

      if(j ==-1){
        return this.questions;
      }

      console.log("questionOptions:array length=["+arrayControl.controls.length+"]");

      var filtered=[];
      if(arrayControl.controls.length > 0){

       /*  for(var i=0;i < arrayControl.controls.length ;i++){
          console.log("selected question=["+arrayControl.controls[i].controls["question"].value+"]");
          var previousValue=arrayControl.controls[i].controls["question"].value;
          console.log("previousvalue=["+previousValue+"]");
          filtered.push(this.questions.filter(function(o) { return o.questionText === previousValue; }));
          //arrayControl.controls[i].controls["questions"].patchValue(filtered);
          console.log("Index=["+i+"],value=["+arrayControl.controls[i].controls.questions.value.length+"]");
        } */
        var previousValue=arrayControl.controls[j].controls["question"].value;
        console.log("filtered=["+JSON.stringify(filtered)+"]");
         //arrayControl.controls[j].controls["questions"].patchValue(filtered);
     
       arrayControl.controls[j].controls["questions"].patchValue(this.questions.filter(function(o) { return o.questionText === previousValue; }));
         

        this.questions = this.questions.filter(function(o) { return o.questionText !== previousValue; });
        console.log("Inside loop=["+JSON.stringify(arrayControl.controls[j].controls['questions'].value)+"]");
        return this.questions;
        
      }
      return this.questions;
    }  

    initRuleCriteria() {
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      let newGroup = this._fb.group({
          question: ['', Validators.required],
          questions:[this.questionOptions(-1,arrayControl)]
        });  
        arrayControl.push(newGroup); 
        
    }

    initAddRuleCriteria(i:number) {
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        var filtered=this.questionOptions(i,arrayControl);
      let newGroup = this._fb.group({
          question: ['', Validators.required],
          questions:[filtered]
        });
            
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

    addRuleCriteria(i:number) {
      console.log("add rule index=["+i+"]");

      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      var status=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
        return formgroup.status=='INVALID';
       })
       if(status){
         return
       }
      console.log("addRuleCriteria:array length=["+arrayControl.controls.length+"]");
      if(arrayControl.controls.length <= this.criteriaCount){
        this.initAddRuleCriteria(i);
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
