import datetime
import uuid
from flask import Flask, render_template, json, jsonify, request
import sqlite3
app = Flask(__name__)


def execute(sql):
    print("running sql: "+sql)
    try:
        conn = sqlite3.connect('db.db')
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
    except sqlite3.DatabaseError as err:
        print("Error running sql")
        print("SQL: "+sql)
        print("ERROR: "+str(err))
        pass


def execute_params(sql, params):
    print("running sql: "+sql)
    try:
        conn = sqlite3.connect('db.db')
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        cur.close()
        conn.close()
    except sqlite3.DatabaseError as err:
        print("Error running sql")
        print("SQL: "+sql)
        print("ERROR: "+str(err))
        pass

def uniqueid():
    return str(uuid.uuid4()).replace('-', '')

def create_db():
    execute("drop table lead")
    execute("drop table task")
    sql_create_task = """
        create table task
        (
            uuid text,
            title text,
            description text,
            duedate timestamp
        )
    """
    execute(sql_create_task)

    execute("insert into task (uuid, title, description, duedate) values ('"+uniqueid()+"', 'title 1','description 1',date('now'))")
    execute("insert into task (uuid, title, description, duedate) values ('"+uniqueid()+"', 'title 2','description 2',date('now'))")
    execute("insert into task (uuid, title, description, duedate) values ('"+uniqueid()+"', 'title 3','description 3',date('now'))")

    sql_create = """
        create table lead (
            uuid text,
             date_added timestamp,
            seller_name text, 
            seller_phone text,
            seller_email text,
            stage_of_lead text,
            who_owns_lead text,
            property_address text,
            correspondance_address text,
            property_link text,
            type_of_property text,
            condition_of_property text,
            notes text,
            why_are_you_selling text,
            how_quickly_want_to_sell text,
            what_you_like_to_see_happening text,
            property_listed_for text,
            property_valued_to_be_worth text,
            how_arrived_at_number text,
            listed_with_agent text,
            mortgaged_state text,
            outstanding_mortgage_amount text,
            other_secured_debt text,
            expectations_of_equity_release_after_sale text
            )
    """
    execute(sql_create)

    sql_create_property = """
        create table property (
            lead_id text,
            postcode text
        )
    """
    execute(sql_create_property)

    id1= uniqueid()
    execute("insert into lead(uuid, seller_name,seller_phone, seller_email, date_added) values ('"+id1+"', 'john','075' ,'switzer.john@gmail.com', date('now'))")

    execute("insert into property (lead_id, postcode) values('"+id1+"','TW170JQ')")
    execute("insert into lead(uuid, seller_name,seller_phone, seller_email, date_added) values ('"+uniqueid()+"', 'richard','075' ,'crsmit1979@gmail.com',date('now'))")

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def run_sql(sql):
    conn = sqlite3.connect('db.db')
    conn.row_factory = dict_factory
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

create_db()

@app.before_request
def before_request():
    try:
        debug = False
        if debug:
            print("----incoming request-----")
            print("url: ")
            print(request.url)
            print("form: ")
            print(request.form)
            print("args: ")
            print(request.args)
            print("values")
            print(request.values)
            print("headers")
            print(request.headers)

            print("json")
            print(request.json)
            print("-------------------------------")
    except:
        pass

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'cache-control,postman-token,Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Cache-Control', '*')
  return response

@app.route("/", methods=['GET'])
def index():
    leads = run_sql("select * from lead")
    return render_template("base.html", leads=leads)

@app.route("/api/leads", methods=['GET'])
def leads_get():
    leads = run_sql("select * from lead")
    return jsonify(leads)
def get_json_parameter(name,json):
    try:
        return json[name]
    except:
        return None

def get_json_value(js, name):
    try:
            return js[name]
    except:
        return None


@app.route("/api/leads", methods=['POST'])
def lead_add():
    content = request.json
    print("....")
    print(content)
    print(get_json_value(content, "seller_name"))
    print("....")
    fields = ['seller_name', 'seller_email', 'seller_phone',
              'stage_of_lead','who_owns_lead',
                'property_address','correspondance_address', 'property_link', 'type_of_property', 'condition_of_property',
                'why_are_you_selling','how_quickly_want_to_sell','what_you_like_to_see_happening',
                'property_listed_for', 'property_valued_to_be_worth','how_arrived_at_number','listed_with_agent', 'mortgaged_state', 'outstanding_mortgage_amount','other_secured_debt','expectations_of_equity_release_after_sale','notes']
    fls = []
    prsval = []
    prs = {}
    for f in fields:
        fls.append(f)
        prsval.append(":"+f)
        prs[f] = get_json_parameter(f,content)
    uuid =uniqueid()
    print(fields)
    print(prsval)
    print(prs)
    sql = "insert into lead (date_added, uuid, %s) values(date('now'), '"+uuid+"', %s)"
    print(sql)
    sql = sql % (", ".join(fields), ", ".join(prsval))

    print(sql)
    execute_params(sql, prs)
    return jsonify({"success":True})

@app.route("/api/tasks", methods=['GET'])
def get_tasks():
    tasks = run_sql("select * from task")
    return jsonify(tasks)

@app.route("/api/tasks/<uuid>", methods=['DELETE'])
def delete_task(uuid):
    execute("delete from task where uuid='"+uuid+"'")
    return jsonify({"success":True})

@app.route("/api/tasks", methods=['POST'])
def add_task():
    sql="insert into task (uuid, title, description, duedate) values (:uuid, :title, :description, :duedate)"
    content = request.json
    params = {
        "uuid": uniqueid(),
        "title": content['title'],
        "description": content['description'],
        "duedate": datetime.datetime.now()
    }
    execute_params(sql, params)
    return jsonify({"success":True})

@app.route("/api/tasks/<uuid>", methods=['PUT'])
def update_task(uuid):
    sql="update task set title=:title, description=:description, duedate=:duedate where uuid=:uuid"
    content = request.json
    params = {
        "uuid": content['uuid'],
        "title": content['title'],
        "description": content['description'],
        "duedate": content['dueDate']
    }
    execute_params(sql, params)
    return jsonify({"success":True})

@app.route("/api/leads/<uuid>", methods=['DELETE'])
def lead_delete(uuid):
    print(uuid)
    execute("delete from lead where uuid='"+uuid+"'")
    return jsonify({"success":True})

@app.route("/api/leads/<uuid>", methods=['PUT'])
def lead_update(uuid):
    content = request.get_json()
    seller_name = content['seller_name']
    seller_phone = content['seller_phone']
    seller_email = content['seller_email']

    fields = ['notes', 'seller_name', 'seller_email', 'seller_phone',
              'stage_of_lead','who_owns_lead',
                'property_address','correspondance_address', 'property_link', 'type_of_property', 'condition_of_property',
                'why_are_you_selling','how_quickly_want_to_sell','what_you_like_to_see_happening',
                'property_listed_for', 'property_valued_to_be_worth','how_arrived_at_number','listed_with_agent', 'mortgaged_state', 'outstanding_mortgage_amount','other_secured_debt','expectations_of_equity_release_after_sale', 'uuid']
    sql = """update lead set  
notes = ?,
seller_name = ?, 
seller_email = ?, 
seller_phone = ?, 
stage_of_lead = ?, 
who_owns_lead = ?, 
property_address = ?, 
correspondance_address = ?, 
property_link = ?, 
type_of_property = ?, 
condition_of_property = ?, 
why_are_you_selling = ?, 
how_quickly_want_to_sell = ?, 
what_you_like_to_see_happening = ?, 
property_listed_for = ?, 
property_valued_to_be_worth = ?, 
how_arrived_at_number = ?, 
listed_with_agent = ?, 
mortgaged_state = ?, 
outstanding_mortgage_amount = ?, 
other_secured_debt = ?, 
expectations_of_equity_release_after_sale = ? where uuid=?"""
    pars = []
    for f in fields:
        if f in content:
            pars.append(content[f])
        else:
            print(f)
            pars.append(None)
    execute_params(sql, pars)

    return jsonify({"success":True})


@app.route("/api/leads/<uuid>/properties", methods=['GET'])
def get_lead_properties(uuid):
    properties = run_sql("select * from property where lead_id='"+uuid+"'")
    return jsonify(properties)

app.run(
    host="127.0.0.1",
    port=3000,
    debug=True
)