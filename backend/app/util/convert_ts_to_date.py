from datetime import datetime

def convert_ts_to_date(ts):
    return datetime.fromtimestamp(ts).strftime('%Y-%m-%d')