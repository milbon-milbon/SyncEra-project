# frontend_requests.py のうち社員情報に関わるエンドポイント

# /add_employee_info/  正常系

def test_add_employee_info(client):
    # 新しい社員情報を追加するためのデータ
    sample_employee_data = {
        "name": "sample taro",
        "email": "sample_taro@gmail.com",
        "department": "development",
        "role": "member",
        "project": "software"
    }

    # POSTリクエストで社員情報を追加
    response = client.post("/add_employee_info/", json=sample_employee_data)

    # ステータスコードが200であることを確認
    assert response.status_code == 200

    # レスポンスの内容を検証
    assert response.json()["name"] == "sample taro"
    assert response.json()["email"] == "sample_taro@gmail.com"

# /add_employee_info/  異常系





# /selected_employee/ 正常系





# /selected_employee/ 異常系

# 存在しない社員を取得
def test_get_nonexistent_employee(client):
    # 存在しない社員IDでGETリクエストを送る
    response = client.get("/selected_employee/nonexistent_id/")

    # ステータスコードが404であることを確認
    assert response.status_code == 404
    assert response.json()["detail"] == "指定されたメンバーが見つかりません"

# 存在しない社員の情報を更新
def test_update_nonexistent_employee(client):
    # 存在しない社員IDで更新リクエストを送る
    employee_update_data = {
        "name": "sample taro",
        "email": "sample_taro_1@gmail.com",
        "department": "development",
        "role": "member",
        "project": "big_project"
    }

    response = client.put("/selected_employee/nonexistent_id/", json=employee_update_data)

    # ステータスコードが404であることを確認
    assert response.status_code == 404
    assert response.json()["detail"] == "指定されたメンバーが見つかりません"


# 存在しない社員を削除
def test_delete_nonexistent_employee(client):
    # 存在しない社員IDで削除リクエストを送る
    response = client.delete("/selected_employee/nonexistent_id/")

    # ステータスコードが404であることを確認
    assert response.status_code == 404
    assert response.json()["detail"] == "指定されたメンバーが見つかりません"
