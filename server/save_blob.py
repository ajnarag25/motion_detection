import re
from time import time
import cv2, pandas
import requests
from datetime import datetime
import base64
import json
import sys

# sys.path.append('/usr/local/lib/python2.7/site-packages')
first_frame = None
status_list = [None,None]
times = []
df=pandas.DataFrame(columns=["date_time", "image" ,])

video = cv2.VideoCapture(0)
print('')
url = 'http://localhost:2023/data'

while True:

    check, frame = video.read()
    status = 0
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray,(5, 5),0)

    if first_frame is None:
        first_frame=gray
        continue
    
    delta_frame=cv2.absdiff(first_frame,gray)
    thresh_frame=cv2.threshold(delta_frame, 150, 255, cv2.THRESH_BINARY)[1]
    thresh_frame=cv2.dilate(thresh_frame, None, iterations=2)

    cnts,_=cv2.findContours(thresh_frame.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in cnts:
        if cv2.contourArea(contour) < 10000:
            continue
        status=1
        (x, y, w, h)=cv2.boundingRect(contour)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,255), 3)
        
    status_list.append(status)
    status_list=status_list[-2:]

    
    if status_list[-1] == 1 and status_list[-2] == 0:
        times.append(datetime.now())
    if status_list[-1] == 0 and status_list[-2] == 1:
        times.append(datetime.now())
        print("MOTION DETECTED" ,datetime.now())
        filename = datetime.now().strftime("%H-%M-%S")
        cv2.imwrite("./image/"+ filename +".jpg", frame)
        print(filename)
        image_encode = cv2.imencode('.jpg', frame)
        extracted_arr = image_encode[1]
        
        image_data = extracted_arr.tobytes()
        image_encode = base64.b64encode(image_data)
        
        image_decode= image_encode.decode('utf-8')
        payload = {
            "date_time":str(datetime.now().strftime("%B %d, %Y - ")+ str(datetime.now().strftime("%H:%M %S sec"))),
            "image":image_decode
        }
        r = requests.post(url, json=payload)
        
        
    cv2.imshow("Color Frame",frame)   
    # WAITKEY
    key=cv2.waitKey(1)
    if key == ord('d'):
        break
    

video.release()
cv2.destroyAllWindows