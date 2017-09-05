import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray,FormControl, FormBuilder, Validators } from '@angular/forms';

import {Message,SelectItem} from 'primeng/primeng';
import {CountryService} from './../service/country-service';
import {Country,Customer,IRule,IQuestion} from './../service/interfaces';

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
sourceQuestions: IQuestion[];

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

    store = new Map<string, string>();
    selectedIds:Set<IQuestion> =new Set<IQuestion>();
    private questionsMap:Map<string, Array<IQuestion>> = 
    new Map([["question1", [{"questionId": "question1","questionText": "questionText1"}]],
    ["question2", [{"questionId": "question2","questionText": "questionText2"}]],
    ["question3", [{"questionId": "question3","questionText": "questionText3"}]],
    ["question4", [{"questionId": "question4","questionText": "questionText4"}]]]);
    


    questionOptions(arrayControl:any): any[] {
      
      var arrayLength=arrayControl.controls.length;
      console.log("questionOptions:array length=["+arrayLength+"]");
      if( arrayLength == 0){
         return this.questions;
      }

      var lastQuestionList=arrayControl.controls[arrayLength-1].controls["questions"].value;
      var lastSelectedQuestion=arrayControl.controls[arrayLength-1].controls["question"].value;
      var lastSelectedQuestionObj= this.questionsMap.get(lastSelectedQuestion);

      var remainingQuestions=[];
      lastQuestionList.forEach( el=>{
            if(el.questionId !=lastSelectedQuestion){
              remainingQuestions.push(el);
            }
      });

      console.log("lastQuestionList=["+JSON.stringify(lastQuestionList)+"]");
      console.log("lastSelectedQuestion=["+JSON.stringify(lastSelectedQuestion)+"]");
      console.log("lastSelectedQuestionObj=["+JSON.stringify(lastSelectedQuestionObj)+"]");
      console.log("remainingQuestions=["+JSON.stringify(remainingQuestions)+"]");

      arrayControl.controls[arrayLength-1].controls["questions"].patchValue(lastSelectedQuestionObj);
      return remainingQuestions;

    
    }  

    initRuleCriteria() {
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      let newGroup = this._fb.group({
          question: ['', Validators.required],
          questions:[this.questionOptions(arrayControl)]
        });  
        arrayControl.push(newGroup); 
        
    }

    initAddRuleCriteria() {
      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        var filtered=this.questionOptions(arrayControl);
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

    addRuleCriteria() {
      //console.log("add rule index=["+i+"]");

      const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
      var status=arrayControl.controls.some(function checkFormGroupStatus(formgroup, index, array) {
        return formgroup.status=='INVALID';
       })
       if(status){
         return
       }
      console.log("addRuleCriteria:array length=["+arrayControl.controls.length+"]");
      if(arrayControl.controls.length <= this.criteriaCount){
        this.initAddRuleCriteria();
      }

     }

    removeRuleCriteria(i: number) {
        const arrayControl = <FormArray>this.myForm.controls['ruleCriterias'];
        console.log("removedIndex=["+i+"]");
        this.removeQuestions(i,arrayControl);

        
    }


    removeQuestions(j:number,arrayControl:any) {
      
              console.log("removeQuestions:array length=["+arrayControl.controls.length+"]");
        /*     var selectedValue=[];
            for(var i=0;i < arrayControl.controls.length;i++){
              selectedValue.push(arrayControl.controls[i].controls["question"].value);
            }

            console.log("selectedValues=["+JSON.stringify(selectedValue)+"]");
            this.myForm.controls['ruleCriterias']=this._fb.array([])
            var removeValue=arrayControl.controls[j].controls["question"].value;
            const array = <FormArray>this.myForm.controls['ruleCriterias'];
            
            selectedValue.forEach( vl => {
              console.log("vl=["+vl+"]");
              var qObj=this.sourceQuestions.filter(function(o) { return o.questionText === vl; });
              console.log("qObj=["+JSON.stringify(qObj)+"]");

              if(vl !=removeValue){
                  let newGroup = this._fb.group({
                    //question: [qObj[0], Validators.required],
                    question: [vl, Validators.required],
                    questions:[this.sourceQuestions]
                  });

                  
                  array.push(newGroup); 
                  //array.controls['question'].setValue([{questionId:qObj[0].questionId,questionText:qObj[0].questionText}]);
              }
          });
                 */
          
            
              var removeValue=arrayControl.controls[j].controls["question"].value;
              var removeQuestionsList=arrayControl.controls[j].controls["questions"].value;

              var removedQuestion=this.sourceQuestions.filter(function(o) { return o.questionText === removeValue; });

              console.log("removedValue=["+removeValue+"]");
              console.log("removedQuestion=["+JSON.stringify(removedQuestion)+"]");
              console.log("removedQuestionList=["+JSON.stringify(removeQuestionsList)+"]");
              
              var length=arrayControl.controls.length;

              if(j != length-1){
                console.log("Inside if remove="+length);
              
              var lastIndexQuestions=arrayControl.controls[length-1].controls['questions'].value;
              console.log("lastIndexQuestions org=["+lastIndexQuestions+"]");

             /*  removedQuestion.forEach(question=>{
                lastIndexQuestions.push(question);
              }) */

              removeQuestionsList.forEach(question=>{
                lastIndexQuestions.push(question);
              })
              console.log("lastIndexQuestions plus removed=["+lastIndexQuestions+"]");
              
              arrayControl.controls[length-1].controls["questions"].patchValue(lastIndexQuestions);
              
              console.log("lastIndexQuestions after patch=["+lastIndexQuestions+"]");
              
            }
            else {
              console.log("Inside else remove="+length);
              var lastIndexQuestions=arrayControl.controls[0].controls['questions'].value;
              console.log("lastIndexQuestions org=["+lastIndexQuestions+"]");

              removeQuestionsList.forEach(question=>{
                lastIndexQuestions.push(question);
              })

              console.log("lastIndexQuestions plus removed=["+lastIndexQuestions+"]");
              
              arrayControl.controls[0].controls["questions"].patchValue(lastIndexQuestions);
              
              console.log("lastIndexQuestions after patch=["+lastIndexQuestions+"]");

            }
      

              arrayControl.removeAt(j);
              var length=arrayControl.controls.length;
              console.log("removeQuestions:array length after removal=["+length+"]");

              //arrayControl.controls[j].controls["questions"].patchValue(this.questions.filter(function(o) { return o.questionText === previousValue; }));
             // this.questions = this.questions.filter(function(o) { return o.questionText !== previousValue; });
              
              
          
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
      this.sourceQuestions=rule.ruleCriteria.questionList;
      //this.questions=questions;


    }




}
