from datetime import date
from app.util.survey_analysis.analysis_functions import (
    filtered_by_slack_user_id_analysis,
    filtered_by_user_and_date,
    latest_response_by_user,
    latest_two_responses_by_user,
    latest_responses_by_user_in_past_year
)

slack_user_id = 'sample_4'
specific_date = date(2024, 8, 13) 
response1 = filtered_by_slack_user_id_analysis(slack_user_id)
print(f'◆◆◆filtered_by_slack_user_id_analysisの結果: {response1}')

response2 = filtered_by_user_and_date(slack_user_id, specific_date)
print(f'◆◆◆filtered_by_user_and_dateの結果: {response2}')

response3 = latest_two_responses_by_user(slack_user_id)
print(f'◆◆◆latest_two_responses_by_userの結果: {response3}')

response4 = latest_responses_by_user_in_past_year(slack_user_id)
print(f'◆◆◆latest_responses_by_user_in_past_yearの結果: {response4}')

response5 = latest_response_by_user(slack_user_id)
print(f'◆◆◆latest_response_by_userの結果: {response5}')
