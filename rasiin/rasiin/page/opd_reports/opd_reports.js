frappe.pages['opd-reports'].on_page_load = function(wrapper) {
	frappe.opd_report = new OpdReport(wrapper);

	$(wrapper).bind('show', ()=> {
		// Get which leaderboard to show
		let doctype = frappe.get_route()[1];
		frappe.opd_report.show_leaderboard(doctype);
	});
}

class OpdReport {

	constructor(parent) {
		frappe.ui.make_app_page({
			parent: parent,
			title: __("OPD Daily Reports"),
			single_column: false,
			card_layout: true,
		});

		this.parent = parent;
		this.page = this.parent.page;
		this.page.sidebar.html(`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar"></ul>`);
		this.$sidebar_list = this.page.sidebar.find('ul');

		this.get_opd_config();

	}
	get_opd_config() {
		this.doctypes = [];
		this.filters = {};
		this.leaderboard_limit = 20;

		frappe.xcall("rasiin.rasiin.page.opd_reports.opd-reports.opd_config").then(config => {
			this.leaderboard_config = config;
		
			for (let doctype in this.leaderboard_config) {
				this.doctypes.push(doctype);
				this.filters[doctype] = this.leaderboard_config[doctype].fields.map(field => {
			
					if (typeof field ==='object') {
						return field.label || field.fieldname;
					}
					return field;
				});
			}

			// For translation. Do not remove this
			// __("This Week"), __("This Month"), __("This Quarter"), __("This Year"),
			//	__("Last Week"), __("Last Month"), __("Last Quarter"), __("Last Year"),
			//	__("All Time"), __("Select From Date")
			this.timespans = [
				"This Week", "This Month", "This Quarter", "This Year",
				"Last Week", "Last Month", "Last Quarter", "Last Year",
				"All Time", "Select Date Range"
			];

			// for saving current selected filters
			const _initial_doctype = frappe.get_route()[1] || this.doctypes[0];
	
			const _initial_timespan = this.timespans[0];
			const _initial_filter = this.filters[_initial_doctype];

			this.options = {
				selected_doctype: _initial_doctype,
				selected_filter: _initial_filter,
				selected_filter_item: _initial_filter[0],
				selected_timespan: _initial_timespan,
			};

			this.message = null;
			this.make();
		});
	}

	make() {
	
		

		this.$container = $(`
		
	
	
		
		<div class="leaderboard page-main-content">
			<div class="leaderboard-graph"></div>
			<div class="leaderboard-list"></div>
		</div>`).appendTo(this.page.main);

		this.$graph_area = this.$container.find(".leaderboard-graph");

		this.doctypes.map(doctype => {
			const icon = this.leaderboard_config[doctype].icon;
			this.get_sidebar_item(doctype, icon).appendTo(this.$sidebar_list);
		});

		this.setup_leaderboard_fields();

		this.render_selected_doctype();

		this.render_search_box();
		this.fill_dash()

		// Get which leaderboard to show
		let doctype = frappe.get_route()[1];
		this.show_leaderboard(doctype);
	

	

	}

	get_sidebar_item(item, icon) {

		let icon_html = icon ? frappe.utils.icon(icon, 'md') : '';
		return $(`<li class="standard-sidebar-item">
			<span>${icon_html}</span>
			<a class="sidebar-link">
				<span class="doctype-text" doctype-value="${item}">${ __(item) }</span>
			</a>
		</li>`);
	}


	setup_leaderboard_fields() {
	
		this.selected_dt = this.page.add_field({
			fieldtype: 'DateRange',
			fieldname: 'selected_date_range',
			placeholder: __("Date Range"),
			default: [frappe.datetime.month_start(), frappe.datetime.now_date()],
			input_class: 'input-xs',
			reqd: 1,

			change: (e) => {
				this.selected_date_range = this.selected_dt.get_value();
				this.make_request();
			}
		});

		

		this.type_select = this.page.add_select(__("Field"),
			this.options.selected_filter.map(d => {
				return {"label": (frappe.model.unscrub(d)), value: d };
			})
		);

	

		this.type_select.on("change", (e) => {
			this.options.selected_filter_item = e.currentTarget.value;
			this.make_request();
		});
	}


	render_selected_doctype() {

		this.$sidebar_list.on("click", "li", (e)=> {
			let $li = $(e.currentTarget);
			let doctype = $li.find(".doctype-text").attr("doctype-value");

		
			this.selected_date_range = [frappe.datetime.month_start(), frappe.datetime.month_end()]
			this.options.selected_doctype = doctype;
			this.options.selected_filter = this.filters[doctype];
			this.options.selected_filter_item = this.filters[doctype][0];

			this.type_select.empty().add_options(
				this.options.selected_filter.map(d => {
					return {"label": __(frappe.model.unscrub(d)), value: d };
				})
			);
		

			this.$sidebar_list.find("li").removeClass("active selected");
			$li.addClass("active selected");

			frappe.set_route("opd-reports", this.options.selected_doctype);
			this.make_request();
		});
	}
	show_leaderboard(doctype) {
		if (this.doctypes.length) {
			if (this.doctypes.includes(doctype)) {
				this.options.selected_doctype = doctype;
				this.$sidebar_list.find(`[doctype-value = "${this.options.selected_doctype}"]`).trigger("click");
			}

			this.$search_box.find(".leaderboard-search-input").val("");
			frappe.set_route("opd-reports", this.options.selected_doctype);
		}
	}
	make_request() {
		this.get_leaderboard(this.get_leaderboard_data);

		// frappe.model.with_doctype(this.options.selected_doctype, ()=> {
		// 	this.get_leaderboard(this.get_leaderboard_data);
		// });
	}
	get_leaderboard(notify) {
	
		frappe.call(
			this.leaderboard_config[this.options.selected_doctype].method,
			{
				'date_range': this.selected_date_range,
			
				'field': this.options.selected_filter_item,
				'limit': this.leaderboard_limit,
			}
		).then(r => {
	
			let results = r.message || [];
	

			// let graph_items = results.slice(0, 10);

			// this.$graph_area.show().empty();

			// const custom_options = {
			// 	data: {
			// 		datasets: [{ values: graph_items.map(d => d.value) }],
			// 		labels: graph_items.map(d => d.name)
			// 	},
			// 	format_tooltip_x: d => d[this.options.selected_filter_item],
			// 	height: 140
			// };
			// frappe.utils.make_chart('.leaderboard-graph', custom_options);

			notify(this, r);
		});
	}

	get_leaderboard_data(me, res) {
		if (res && res.message.length) {
			me.message = null;
			me.$container.find(".leaderboard-list").html(me.render_list_view(res.message));
			frappe.utils.setup_search($(me.parent), ".list-item-container", ".list-id");
		} else {
			me.$graph_area.hide();
			me.message = __("No Items Found");
			me.$container.find(".leaderboard-list").html(me.render_list_view());
		}
	}


	render_search_box() {

		this.$search_box =
			$(`<div class="leaderboard-search form-group col-md-3">
				<input type="text" placeholder=${ __("Search") } data-element="search" class="form-control leaderboard-search-input input-xs">
			</div>`);

		$(this.parent).find(".page-form").append(this.$search_box);
	}

	render_list_view(items = []) {

		let dash = this.get_dash()

		var html =
			`
			${dash}
			<div class="result" style="${this.message ? "display: none;" : ""}">
				${this.render_result(items)}
			</div>`;

		return $(html);
	}

	render_result(items) {

		var html =
			`${this.render_list_header()}
			${this.render_list_result(items)}`;
		return html;
	}

	render_list_header() {
		const _selected_filter = this.options.selected_filter
			.map(i => frappe.model.unscrub(i));
			let fields  = this.get_header()
	
		const filters = fields.map(filter => {
			
			const col = __(frappe.model.unscrub(filter));
		
			return (
				`<div class="leaderboard-item list-item_content ellipsis text-muted list-item__content--flex-2
					header-btn-base ${filter}
					${(col && _selected_filter.indexOf(col) !== -1) ? "text-right" : ""}">
					<span class="list-col-title ellipsis">
						${col}
					</span>
				</div>`
			);
		}).join("");

		const html =
			`<div class="list-headers">
				<div class="list-item" data-list-renderer="List">${filters}</div>
			</div>`;
		return html;
	}



	render_list_result(items) {


		let _html = items.map((item, index) => {
			const $value = $(this.get_item_html(item, index+1));
			const $item_container = $(`<div class="list-item-container">`).append($value);
			
			return $item_container[0].outerHTML;
		}).join("");


		let html =
			`<div class="result-list">
				<div class="list-items">
					${_html}
				</div>
			</div>`;
		
		return html;
	}

	// render_message() {
	// 	const display_class = this.message ? '' : 'hide';
	// 	let html = `<div class="leaderboard-empty-state ${display_class}">
	// 		<div class="no-result text-center">
	// 			<img src="/assets/frappe/images/ui-states/search-empty-state.svg"
	// 				alt="Empty State"
	// 				class="null-state"
	// 			>
	// 			<div class="empty-state-text">${this.message}</div>
	// 		</div>
	// 	</div>`;

	// 	return html;

	// }

	get_item_html(item, index) {

		let html = []

		if(this.options.selected_doctype == 'Patient Appointment'){
		 html =
			`<div class="list-item">
				<div class="list-item_content ellipsis list-item__content--flex-2 rank ">
					<span class="text-muted ellipsis">${index}</span>
				</div>
				<div class="list-item_content ellipsis list-item__content--flex-2 name">
					${item.name}
				</div>
				<div class="list-item_content ellipsis list-item__content--flex-2 name">
				${item.ctn}
			</div>
			<div class="list-item_content ellipsis list-item__content--flex-2 name">
			${item.nw}
		</div>
		<div class="list-item_content ellipsis list-item__content--flex-2 name">
		${item.fl}
	</div>
	<div class="list-item_content ellipsis list-item__content--flex-2 name">
	${item.rv}

</div>
			
			</div>`; 
		}
		else if(this.options.selected_doctype == 'Patient Encounter mmm'){
			html =
			`<div class="list-item">
				<div class="list-item_content ellipsis list-item__content--flex-2 rank ">
					<span class="text-muted ellipsis">${index}</span>
				</div>
				<div class="list-item_content ellipsis list-item__content--flex-2 name">
					${item}
				</div>
				</div>
		

		}`
	}
	
		return html;
	}


	//Statits for dashboard
	get_dash() {
		this.dash = ``;
		if(this.options.selected_doctype == 'Patient Appointment'){
		
		this.dash = `
		
		<div class = 'row mb-5 mt-3'>
		
		<div class = "col-md-3">
			
		<div class="card bg-primary" style="width: 15rem;">
  
			<div class="card-body text-white">
			<h3 class = 'text-center text-white ' >Total Appointment</h3>
			<h3 class = 'text-center text-white ' id ='tapp'>10</h3>

			</div>
			</div>


		</div>

		<div class = "col-md-3">
			
		<div class="card bg-danger" style="width: 15rem;">
  
			<div class="card-body text-white">
			New Appointments

			</div>
			</div>


		</div>


		<div class = "col-md-3">
			
		<div class="card bg-primary" style="width: 15rem;">
  
			<div class="card-body text-white">
			Follow up

			</div>
			</div>


		</div>
	<div class = "col-md-3">
			
		<div class="card bg-danger" style="width: 15rem;">
  
			<div class="card-body text-white">
			Revisit

			</div>
			</div>
		</div>
		</div>
		
		`;
		}
		else {
			this.dash = `	<div class = "col-md-3">
			
			<div class="card bg-danger" style="width: 15rem;">
	  
				<div class="card-body text-white">
				Revisit
	
				</div>
				</div>
			</div>`;
		}
		return this.dash
	}

	// Table header
	get_header() {
			let  header = []
			if(this.options.selected_doctype == 'Patient Encounter mmm'){
					header = ["No", "Name" ];
			}
			else if(this.options.selected_doctype == 'Patient Appointment'){
				header = ["No", "Name" , 'Total Appointments', 'New Appointment', 'Follow up', 'Revisit'];
			}
			return header
		}

	fill_dash(){
		var app = document.getElementById('tapp')
		console.log(app)
		frappe.call({
            method: "rasiin.rasiin.page.opd_reports.opd-reports.appoint_static", //dotted path to server method
            callback: function(r) {
				
                // code snippet
				
			
				app.innerText = 30
				
			
			
            }
        })
	}



}