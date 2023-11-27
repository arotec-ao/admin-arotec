export function toInt(value: string | number){
    if(!Number.isNaN(value)){
        return parseInt(value.toString());
    }
    else{
        throw "Não é um número!";
    }
}

export function formatNumber(value:number){
    var finalString:string="";
    let maxNumber:number=3;
    let countNumber:number=0;
    
  
   for(let x =value.toString().length-1; x >= 0; x--){

        if(countNumber == maxNumber){
            finalString='.'+ finalString;
            countNumber=0;
        }

        finalString = value.toString()[x]+finalString;
        countNumber++;
   }
 
   return finalString;
}