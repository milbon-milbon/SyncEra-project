import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import (
    UserResponse
)
from sqlalchemy.exc import SQLAlchemyError

def seed_data():
    db: Session = SessionLocal()

    try:
        '''
        キャリアアンケート設問、回答選択肢
        '''

        response1 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 1,
            answer = 'A',
            free_text = None
        )

        response2 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 2,
            answer = 'C',
            free_text = None
        )

        response3 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 3,
            answer = 'B',
            free_text = None
        )

        response4 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 6,
            answer = 'C',
            free_text = None
        )

        response5 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 9,
            free_text = 'データ分析、データサイエンス'
        )

        response6 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 11,
            answer = 'A',
            free_text = None
        )

        response7 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 12,
            answer = 'A',
            free_text = None
        )

        response8 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 13,
            answer = 'B',
            free_text = None
        )

        response10 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 14,
            answer = 'A',
            free_text = None
        )

        response11 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 15,
            answer = 'C',
            free_text = None
        )

        response12 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 16,
            answer = 'C',
            free_text = None
        )

        response13 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 17,
            answer = 'B',
            free_text = None
        )

        response14 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 18,
            answer = 'A',
            free_text = None
        )

        response15 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 19,
            answer = 'B',
            free_text = None
        )

        response16 = UserResponse(
            slack_user_id = 'sample_4',
            question_id = 20,
            free_text = '転職を検討中です'
        )


        db.add_all([response1, response2, response3, response4, response5, response6, response7, response8, response10, response11, response12, response13, response14, response15, response16])
        db.commit()

        print("シーディングが完了しました")

    except SQLAlchemyError as e:
        db.rollback()
        print(f"シーディング中にエラーが発生しました: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()



