function deepClone(value: any): any{
    if (Array.isArray(value)){
        return value.map(deepClone);
    } else if ((typeof value) == "object"){
        let obj: any = {};
        for (let key in value){
            obj[key] = deepClone(value[key]);
        }
        return obj;
    } else {
        return value;
    }
}
export {deepClone};