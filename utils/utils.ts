export function toInt(value: string | number){
    if(!Number.isNaN(value)){
        return parseInt(value.toString());
    }
    else{
        throw "Não é um número!";
    }
}