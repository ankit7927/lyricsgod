const { handlebars } = require("hbs")

handlebars.registerHelper("modifyDate", (date) => {
    return new Date(date).toLocaleDateString()
})

handlebars.registerHelper("shortDic", (dic) => {
    if (dic < 145) return dic
    else return dic.slice(0, 145) + "..."
})

handlebars.registerHelper("incPage", (num)=>{
    return num+1
})