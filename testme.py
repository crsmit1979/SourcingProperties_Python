import json
import gspread
from oauth2client.client import SignedJwtAssertionCredentials

json_key = json.load(open('GoogleSheets-cb20611a80e5.json')) # json credentials you downloaded earlier
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'].encode(), scope) # get email and key from creds

file = gspread.authorize(credentials) # authenticate with Google
sheet = file.open("Property Sourcing Deals").worksheet("City Populations") # open sheet

#reading cells
max_rows = len(sheet.get_all_values())
