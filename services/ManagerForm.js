
 export class ManagerForm 
 {
    constructor(){

    }



    static validateText(value,min,fieldName){
        const text = value.trim();
        if(text === "") return ` ${fieldName} no puede estar en blanco`
        if(text.length <= min){ return ` ${fieldName} debe tener mas de ${min} caracteres`}
        return null;
     }
     
      static validateRequired(value,fieldName){
        if(!value || value.trim() === "") return ` ${fieldName} es obligatorio`;
        return null;

     }



}