from __future__ import unicode_literals, print_function
import frappe
from frappe.utils import cint
@frappe.whitelist()
def opd_config():
	opd = {
			"Patient Appointment": {
			"fields": [
				{'fieldname': 'by department', 'fieldtype': 'Currency'},
				
				{'fieldname': 'by practitioner', 'fieldtype': 'Currency'}
			],
			"method": "rasiin.rasiin.page.opd_reports.opd-reports.get_op",
			"icon": "customer"
		},
			"Patient Encounter mmm": {
			"fields": [
				{'fieldname': 'total_sales_amount', 'fieldtype': 'Currency'},
				'total_qty_sold',
				{'fieldname': 'outstanding_amount', 'fieldtype': 'Currency'}
			],
			"method": "rasiin.rasiin.page.opd_reports.opd-reports.opd_income",
			"icon": "customer"
		},
	}
	return opd


@frappe.whitelist()
def get_op(date_range,  field, limit = None):
	date_range = frappe.parse_json(date_range)
	print('\n\n\n\n\n\n',date_range[0],'\n\n\n\n\n\n')
	if field == 'by department':
		appointments = frappe.db.sql(f"""select  department as name, count(department) as ctn ,
		count(case when appointment_state = "Revisit" then 1 else null end) as rv ,
		count(case when appointment_state is null then 1 else null end) as nw ,
		count(case when appointment_state = "Follow up" then 1 else null end) as fl 
		
		from `tabPatient Appointment` where appointment_date between '{date_range[0]}' and '{date_range[1]}' group by department;""", as_dict=1)
	else:
		appointments = frappe.db.sql(f"""select  practitioner_name as name, count(practitioner) as ctn ,
		count(case when appointment_state = "Revisit" then 1 else null end) as rv ,
		count(case when appointment_state is null then 1 else null end) as nw ,
		count(case when appointment_state = "Follow up" then 1 else null end) as fl 
		
		from `tabPatient Appointment` where appointment_date between '{date_range[0]}' and '{date_range[1]}' group by practitioner;""", as_dict=1)
	return appointments


@frappe.whitelist()
def appoint_static():
	app = 13
	newapp = 8
	flup = 2
	rvis = 0
	return [{'app' : app , 'newapp' : newapp , 'flup' : flup , 'rvis' : rvis}]
	 

@frappe.whitelist()
def opd_income():
	return [1,2,3,4]