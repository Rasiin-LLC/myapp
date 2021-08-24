frappe.pages['statement'].on_page_load = function(wrapper) {

	new MyPage(wrapper)
}
MyPage = Class.extend({
	init: function(wrapper) {
	    this.page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Beds',
		single_column: true
	});
	this.make();
	
},

		make:function(){
			let me = $(this) ;
			// let body = `<h1>ok ok</h1>`;
		
		$(frappe.render_template(frappe.rasiin_page.body , this)).appendTo(this.page.main);
		// $(frappe.render_template(body , this)).appendTo(this.page.main);

		// vanats();
		filterWard()
		jQueryDatatableStyle

		
	}
	});


var jQueryDatatableStyle = document.createElement("link");
jQueryDatatableStyle.rel = 'stylesheet';
jQueryDatatableStyle.type = "text/css";
jQueryDatatableStyle.href = "https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css";
jQueryDatatableStyle.onload = function(){
console.log("jQuery Datatable Style Loaded");
};

var jQueryDatatableScript = document.createElement("Script");
jQueryDatatableScript.src = 'https://cdn.datatables.net/buttons/1.7.1/js/dataTables.buttons.min.js'
var jQueryDatatableScript2 = document.createElement("Script");
jQueryDatatableScript2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js'
var jQueryDatatableScript3 = document.createElement("Script");
jQueryDatatableScript3.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js'
var jQueryDatatableScript3 = document.createElement("Script");
jQueryDatatableScript3.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js'
var jQueryDatatableScript4 = document.createElement("Script");
jQueryDatatableScript4.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js'
var jQueryDatatableScript4 = document.createElement("Script");
jQueryDatatableScript4.src = 'https://cdn.datatables.net/buttons/1.7.1/js/buttons.html5.min.js'
var jQueryDatatableScript5 = document.createElement("Script");
jQueryDatatableScript5.src = 'https://cdn.datatables.net/buttons/1.7.1/js/buttons.print.min.js'


document.head.appendChild(jQueryDatatableStyle);
document.body.appendChild(jQueryDatatableScript)
document.body.appendChild(jQueryDatatableScript2)
document.body.appendChild(jQueryDatatableScript3)
document.body.appendChild(jQueryDatatableScript4)
document.body.appendChild(jQueryDatatableScript5)

$.getScript("https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js", function () {
    function format ( d ) {
      
    };


	var data = []
    arr = [1,2,3,4,5,6]
	arr.forEach(element => {
		data.push(  {
			"DT_RowId": "row_5",
			"first_name": "Airi",
			"last_name": "Satou",
			"position": "Accountant",
			"office": "Tokyo",
			"start_date": "28th Nov 08",
			"salary": "$162,700"
		  })
		
	});
  
     
    $(document).ready(function() {
       $('#example').DataTable( {
		
            "processing": true,
			
            "data": data,
            "columns": [
                {
                    
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ""
                },
                { "data": "first_name" },
                { "data": "last_name" },
                { "data": "position" },
                { "data": "office" }
            ],
            "order": [[1, 'asc']],
			
        } );
     
        // Array to track the ids of the details displayed rows
        var detailRows = [];
     
   
     
        // On each draw, loop over the `detailRows` array and show any child rows
      
    } );
});
let filterWard = function(){
	var filterInput = document.getElementById("mybtn");
	console.log(filterInput)

	
	filterInput.addEventListener("click" , (e) => {
		

	var divToPrint=document.getElementById("example");
	newWin= window.open("");
	newWin.document.write(divToPrint.outerHTML);
	newWin.print();
	newWin.close();
		
	

	
	})


}


	let body = `
	<div><button class = "btn btn-primary" id = "mybtn">Beds Status by Ward</button></div>
	
			<div class="form-outline float-right ">
			<input type="search" id="form1" class="form-control border border-primary" placeholder="Search by Ward"
			aria-label="Search" />
			</div>

			<div class = "contianer mt-5" >
			<div><h3>Beds Status by Ward</h3></div>
			<div class = "row mb-10" id = "occ">  

		
			
		  </div>


		  <table id="example" class="display  .table-striped" style="width:100%">
		  <thead>
			  <tr>
				  <th></th>
				  <th>First name</th>
				  <th>Last name</th>
				  <th>Position</th>
				  <th>Office</th>
			  </tr>
		  </thead>

	  </table>

		  
		  
	

		
	<div class = "row" id = "bedtable">
	
	
		
		</div>

		</div>
	`;

	frappe.rasiin_page = {
		body : body
	}
