/////Budget controlloer Module
let budgetController = (function(){

    //constructor function
    let Income = function(id , desc , amount){
        this.id = id;
        this.desc = desc;
        this.amount = amount;
        
    }
    let Expense = function(id , desc , amount){
        this.id = id;
        this.desc = desc;
        this.amount = amount;
        this.percentage = -1;
    }

    //adding prototype for calculating percentage
    Expense.prototype.calcPerc= function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round((this.amount/totalIncome) *100 );
        }
        else{
            this.percentage = -1;
        }
    };

    //returning percentage
    Expense.prototype.retruningPerc = function(){
        return this.percentage;
    }

    
    //calculating budget
    let calculateTotal = function(type){
        let sum =0;
        data.allitems[type].forEach(function(current){
            sum = sum + current.amount;
        });
        data.totalAmount[type] = sum;
    }

    //object of arrays of containg these data
    let data = {
        allitems: {               //object of arrays
            exp: [],
            inc: []
        },
        totalAmount: {          //starting amount object
            exp: 0,
            inc: 0
        },
            budget: 0,
            percentage: -1     //nonexistent
        
    };


    return {
        //for adding new list item of exp/inc
        addItem: function(type, des , amnt){
            let item , ID;
            
        //creating id for every list item(Income(ID,...))       ID = lastitemId + 1
        if(data.allitems[type].length > 0){
        ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
        }
        else{
            ID = 0;
        }
        //adding
        if(type === 'inc'){
            item = new Income(ID , des, amnt)
        }
        else if(type === 'exp'){
            item = new Expense(ID , des , amnt)
        }
        //pushing it into data arrays
        data.allitems[type].push(item);

        //returning new element
        return item;
    },

   
    calculateBudget: function(){
        //calculate total income or expense
        calculateTotal('inc');
        calculateTotal('exp');

        //calculate budget i.e. income-expense
        
        data.budget = data.totalAmount.inc - data.totalAmount.exp;
        
        //calculate percentage
        if(data.totalAmount.inc > 0){
        data.percentage = Math.round((data.totalAmount.exp / data.totalAmount.inc) * 100);
        }
        else{
            data.percentage = 0;
        }
    },
    returningBudget: function(){
        return{
            budget: data.budget,
            percentage: data.percentage,
            inc: data.totalAmount.inc,
            exp: data.totalAmount.exp
        };
    },

    //calculate percentage of individual expense
    calculatePercentage: function(){
        /*E1=10      totalincome=100
          E2=20
          percenatge= 10/100 *100
          20/100 * 100
        */
       data.allitems.exp.forEach(function(current){
            current.calcPerc(data.totalAmount.inc);
       });
   
    },

    //returning percentages
    returnPercentage: function(){
        let percent = data.allitems.exp.map(function(current){
            return current.retruningPerc();
        });
        return percent;

    },

    deletingItem: function(type , id){
        //[1,2,4,7,9]     our ids would be like this so we will be deleting by index no of that id
        //id=4 , index = 2

        let idArray = data.allitems[type].map(function(current){
            return current.id;
        });
        let Index = idArray.indexOf(id);

        if(Index !== -1){
            data.allitems[type].splice(Index , 1);
        } 
    },

    listitem : function(){
        console.log(data.allitems);
    }
    };


})();



////////UI Controller Module
let UIcontroller = (function(){
    
    let DOMstrings = {
        inputType:      '.add_type',
        inputText:      '.descrip',
        inputNumber:    '.amount',
        addBtn:         '.submit',
        incomeList:     '.income_list',
        expenseList:    '.expense_list',
        budget:         '.current_budget',
        currentIncome:  '.income_value',
        currentExpense: '.expense_value',
        percentage:     '.expense_percent',
        listContainer:  '.list_container',
        expList_perc:   '.item__percentage'   
    };
    //creating our own forEach
    let nodeListforEach = function(list, callbackFunc){
        for (let i = 0; i< list.length; i++){
            callbackFunc(list[i], i);           //passing argumnts of curr and index
        }
    };

    //returning public OBJECT to UIcontroller
    return {
        //returning dom strings to use in controller module
        domVar: function(){
            return DOMstrings;
        },

        inputBar: function(){
            
            //returning an object so we can use it in another module
            return{
                type: document.querySelector(DOMstrings.inputType).value,   //inc or exp
                text: document.querySelector(DOMstrings.inputText).value,
                amount: parseFloat(document.querySelector(DOMstrings.inputNumber).value)
            };
        },
        
        //adding list item to ui
        addListItem: function(type , obj){
            let htmlchunk , Rephtml , element;
            //creating html string with placeholders
            if(type === 'inc'){
            element = DOMstrings.incomeList;
            htmlchunk ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">Rs. %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp')
            {
            element = DOMstrings.expenseList;
            htmlchunk = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">Rs. %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replacing p.h with data
            Rephtml = htmlchunk.replace('%id%', obj.id);
            Rephtml = Rephtml.replace('%desc%', obj.desc);
            Rephtml = Rephtml.replace('%value%', obj.amount);

            //inserting into the dom with adjacenthtml()
            document.querySelector(element).insertAdjacentHTML('beforeend',Rephtml);
            
        },

        //clearing fields
        clearingFields: function(){
           let fieldsList = document.querySelectorAll(DOMstrings.inputText + ', ' + DOMstrings.inputNumber); //returns a list

           //converting list into array by using slice()
           let fieldsArray = Array.prototype.slice.call(fieldsList);

           //using forEach() method for looping
           fieldsArray.forEach(function(current){
            current.value = ""; 
           });
            //using focus() on descrption
           fieldsArray[0].focus(); 
        },

        //display budget
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budget).textContent = 'Rs. ' + obj.budget;
            document.querySelector(DOMstrings.currentIncome).textContent = 'Rs. ' + obj.inc;
            document.querySelector(DOMstrings.currentExpense).textContent = 'Rs. ' + obj.exp;
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.percentage).textContent = '--';
            }
        },

        //deletingitem
        deleteItem: function(itemid){
            let element = document.getElementById(itemid);
            element.parentNode.removeChild(element);
        },

        displayExpPerc: function(percenatge){           //percentage array

            let nodeList = document.querySelectorAll(DOMstrings.expList_perc);
            
            //calling forEach function
            nodeListforEach(nodeList , function(current , index){
                if(percenatge[index] > 0){
                    current.textContent = percenatge[index] + '%' ;
                }
                else
                {
                    current.textContent = '--';
                }
            });
        },
        displayMonth: function(){
            let now , month , year;

            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector('.month').textContent = months[month] + ' ' + year;
        },

        changeEvent: function(){
            let nList = document.querySelectorAll(DOMstrings.inputText + ',' + DOMstrings.inputNumber);
            
            nodeListforEach(nList, function(current){
                current.classList.toggle('red-focus');
            });
        }

    }

})();



///////Global controller Module
let gController= (function(bController, uController){
   
    //for init func
    let setupEventLis= function(){
        let Dom = uController.domVar();        //getting domStrings

    //button press event
    document.querySelector(Dom.addBtn).addEventListener('click',addButton);

    //Keypress Event
    document.addEventListener('keypress',function(event){
        if(event.keyCode === 13 || event.which === 13){
            addButton();
        }
    });
    //delete event
    document.querySelector(Dom.listContainer).addEventListener('click', deleteButton);

    //change event
    document.querySelector(Dom.inputType).addEventListener('change', uController.changeEvent);

    };

    let Budget = function(){
        //1- calculate the budget
        bController.calculateBudget();

        //2-returning buget from budgtcontrlr
        let returnBudget = bController.returningBudget();

        //3- display on ui
        uController.displayBudget(returnBudget);
    };

    let updatePercentage = function(){
        //calculate the percntge
        bController.calculatePercentage();
        //ruturning percntge from budget contrlr
        let returnPercent =  bController.returnPercentage();
        //display
        uController.displayExpPerc(returnPercent);
    };

    let addButton = function(){

        //1-get the input from feilds
        let input = uController.inputBar();
        
        if(input.text !== "" && !isNaN(input.amount) && input.amount > 0){
        //2-add list item to buget controller
        let listItem = bController.addItem(input.type, input.text , input.amount);

        //3-add list item on ui
        uController.addListItem(input.type , listItem);
        uController.clearingFields();

        //4-calculte and display budget
        Budget();
        
        //5-calculate and display percentage
        updatePercentage();

        }
        else{
            window.alert('Please enter a valid Amount/Description.');
        
        }

    };

    let deleteButton = function(event){
        let ItemId, splitId, type , Id;

        ItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(ItemId){
            splitId = ItemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);
           
            //deleting item from data
            bController.deletingItem(type , Id);
            //delete the item from ui
            uController.deleteItem(ItemId);
            //update budget and dipslay
            Budget();
            //update percntge and display
            updatePercentage();
        }
        
    };

    return {
        init: function(){
            setupEventLis();
            uController.displayMonth();
            uController.displayBudget({
                budget: 0,
                percentage: 0,
                inc: 0,
                exp: 0
            });
            document.querySelector('.add_type').value = 'inc';
        } 
    };
   

    

})(budgetController,UIcontroller);

//calling init function
gController.init();