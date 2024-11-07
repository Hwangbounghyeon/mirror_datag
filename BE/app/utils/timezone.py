import pytz
from datetime import datetime, timezone, timedelta

kst = pytz.timezone('Asia/Seoul')

def get_current_time():
    return datetime.now(kst)
