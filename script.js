let lastPressed;
let timer;
let totalPages, currentPage=1;
let authorName;

function init(){
    let pageButtons = document.querySelector("#pageButtons");
    pageButtons.style.display = "none";
}

function textChanged(e){
    console.log("Text is changed");
    if(lastPressed==undefined || Date.now-lastPressed<3000){
        if(timer!=undefined)
            clearTimeout(timer);
        timer = setTimeout(()=>{
            console.log("API call made");
            lastPressed = Date.now;
            authorName = document.getElementById("searchBox").value;
            makeApiCallAndPopulate(`https://jsonmock.hackerrank.com/api/articles?author=${authorName}`);
        }, 3000);
    }
}

async function makeApiCallAndPopulate(query){
    let data = await fetch(query);
    let finalData = await data.json();
    console.log(query);
    console.log(finalData.data);
    let titles = getProperty(finalData.data, "title");
    setPageInfo(finalData);
    fillData(titles, "searchedItems");
    pageButtons.style.display = "";
}

function getProperty(dataNodes, propName){
    let propList = [];
    for(let i=0; i<dataNodes.length; i++){
        let currNode = dataNodes[i];
        if(currNode[propName]!=null && currNode[propName]!="")
            propList.push(currNode[propName]);
    }
    return propList;
}

function fillData(propertyList, listId){
    let suggestionList = document.getElementById(listId);
    suggestionList.innerHTML = "";
    for(let i=0; i<propertyList.length; i++){
        let newListItem = document.createElement("li");
        newListItem.innerText = propertyList[i];
        suggestionList.appendChild(newListItem);
    }
}

function search(e){
    authorName = document.getElementById("searchBox").value;
    makeApiCallAndPopulate(`https://jsonmock.hackerrank.com/api/articles?author=${authorName}`);
}

function setPageInfo(data){
    totalPages = data["total_pages"];
    currentPage = data["page"];
    document.querySelector("#currPage").innerText = currentPage;
    if(currentPage==1)
        document.querySelector("#previousBtn").disabled = true;
    else
        document.querySelector("#previousBtn").disabled = false;

    if(currentPage==totalPages)// || totalPages==0)
        document.querySelector("#nextBtn").disabled = true;
    else
        document.querySelector("#nextBtn").disabled = false;

}

function changePage(direction){
    let newPage = currentPage;
    if(direction=="next"){
        newPage++;
        document.querySelector("#nextBtn").disabled = true
    }
    else {
        newPage--;
        document.querySelector("#previousBtn").disabled = true
    }
    makeApiCallAndPopulate(`https://jsonmock.hackerrank.com/api/articles?author=${authorName}&page=${newPage}`);
}

/*
var globalVar = "abc";
(function outerFunction (outerArg) {
  var outerFunction = 'x';    
  (function innerFunction (innerArg) {
    var innerFunction = "y";
    console.log(         
      "outerArg = " + outerArg + "\n" +
      "outerFunc = " + outerFunction + "\n" +
      "innerArg = " + innerArg + "\n" +
      "innerFunc = " + innerFunction + "\n" +
      "globalVar = " + globalVar);
  })(5); 
})(7);
*/