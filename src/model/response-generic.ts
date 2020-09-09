export class ResponseGeneric {
    public status:boolean;
    public message:string;
    public data:object;

    constructor(status:boolean,message:string,data:object){
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
