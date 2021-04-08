let abFilter = 25

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterWidth = 500 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 600 - scatterMargin.top - scatterMargin.bottom;

let distrLeft = 500, distrTop = 0;
let distrMargin = {top: 10, right: 30, bottom: 30, left: 60},
    distrWidth = 500 - distrMargin.left - distrMargin.right,
    distrHeight = 500 - distrMargin.top - distrMargin.bottom;

let teamLeft = 0, teamTop = 520;
let teamMargin = {top: 10, right: 30, bottom: 30, left: 60},
    teamWidth = 1000 - teamMargin.left - teamMargin.right,
    teamHeight = 200 - teamMargin.top - teamMargin.bottom;

 d3.csv("players.csv").then(rawData =>{
const svg = d3.select("#mydata").append("svg")
    .attr("width", scatterWidth+scatterMargin.left+scatterMargin.right)
    .attr("height",scatterHeight+scatterMargin.top+scatterMargin.bottom)

const g = svg.append("g")
   .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)
    rawData=rawData.filter(d=>{
         return d.AB>abFilter;
     });
 var Data=rawData.map(w=>{
       return{
        playername:w.nameGiven,
        H_AB: Number(w.H)/Number(w.AB),
        SO_AB: Number(w.SO)/Number(w.AB),
        Salary:Number(w.salary),
        team:w.teamID
       };
     });
var data_output =d3.nest()
          .key(function(d){
              return d.teamID;
          })

          .rollup(function(q){
              return q.length;
          })
          .entries(rawData)
console.log(data_output)
//x label
g.append("text")
.attr("x",(scatterWidth/2))
.attr("y",scatterHeight-50)
.attr("font-size","10px")
.attr("text-anchor","middle")
.text("H/AB")
//Y label
g.append("text")
.attr("x",-(scatterHeight/2))
.attr("y",-40)
.attr("font-size","10px")
.attr("text-anchor","middle")
.attr("transform","rotate(-90)")
.text("SO/AB")
//Add X axis
let x = d3.scaleLinear()
.domain([0,d3.max(Data,d=>d.H_AB)])
.range([0, scatterWidth])
const xAxisCall = d3.axisBottom(x)
g.append("g")
 .attr("transform", `translate(0,${scatterHeight-100})`)
 .call(xAxisCall)
 .selectAll("text")
 .attr("y","10")
 .attr("x","5")
 .attr("text-anchor","end")
 
//Add Y axis
let y = d3.scaleLinear()
          .domain([0,d3.max(Data,d=>d.SO_AB)])
          .range([scatterHeight-100,0])
    
g.append("g")
 .call(d3.axisLeft(y));
//ADD Circle
g.append("g")
 .selectAll("circle")
 .data(Data)
 .enter()
 .append("circle")
 .attr("cx",function(d){return x(d.H_AB);})
 .attr("cy",function(d){return y(d.SO_AB);})
 .attr("r","1.5")
 .style("fill","#69b3a2")
//svg1
const svg1 = d3.select("#meta").append("svg")
               .attr("width",teamWidth+teamMargin.left+teamMargin.right)
               .attr("height",teamHeight+teamMargin.top+teamMargin.bottom)
const g1 = svg1.append("g")
               .attr("transform", `translate(${teamMargin.left}, ${teamMargin.top})`)
//x label
g1.append("text")
 .attr("x",(teamWidth/2))
 .attr("y",teamHeight+30)
 .attr("font-size","10px")
 .attr("text-anchor","middle")
 .text("Team")
//y label
g1.append("text")
.attr("x",-(teamHeight/2))
.attr("y",-40)
.attr("font-size","10px")
.attr("text-anchor","middle")
.attr("transform","rotate(-90)")
.text("Number of palyers")
//Add x axis
 const x1= d3.scaleBand()
   .domain(data_output.map(d=>{return d.key;}))
   .range([0,teamWidth])
   .paddingInner(0.4)
   .paddingOuter(0.2)
   const Xaxiscall=d3.axisBottom(x1)
   g1.append("g")
    .attr("transform", `translate(0,${teamHeight})`)
    .call(Xaxiscall)
    .selectAll("text")
    .attr("y","5")
    .attr("x","-5")
    .attr("text-anchor","end")
    .attr("transform","rotate(-40)")
//Add Y axis
let y1 = d3.scaleLinear()
          .domain([0,60])
          .range([teamHeight,0])
    
g1.append("g")
 .call(d3.axisLeft(y1));
// rect
g1.selectAll("rect")
.data(data_output)
.enter()
.append("rect")
.attr("y",function(d){return y1(d.value);})
.attr("x",function(d){return x1(d.key);}) 

.attr("width", x1.bandwidth)
.attr("height", d => teamHeight - y1(d.value))
.attr("fill", "#69b3a2")
            }).catch(function(error){
     console.log(error);
 });




