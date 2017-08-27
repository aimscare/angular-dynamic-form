export interface Country {
    name: any;
    dial_code?: any;
    code?: any;
}

export interface Customer {
    name: string;
    addresses: Address[];
}

export interface Address {
    street: string;
    postcode: string;
}

export interface IRule {
    ruleId: string;
    ruleName: string;
    ruleCriteria:IRuleCriteria;

}

export interface IRuleCriteria{
    optionList:IOption[];
    questionList:IQuestion[];
    selections:ISelections[];

}

export interface ISelections{
  selectedOptionId:string;
  selectedQuestionId:string;
  selectedOptionText:string;
  selectedQuestionText:string;
}


export interface IOption {
    optionId: string;
    optionText: string;
}

export interface IQuestion {

    questionId: string;
    questionText: string;
    //options:IOption[];
}
