from fastapi import APIRouter

router = APIRouter()

@router.get("/エンドポイント名/")
def 関数名():
    return "何を返そうか"

# サマリー出力リクエストがあった時 　GET /print_summarize/:member_id　by client
# サマリーに基づいたアドバイス/質問出力リクエストがあった時 　GET /print_summarize/:member_id　by client
# キャリアアンケート結果の出力リクエストがあった時 GET /print_career_survey_result/:member_id　by client