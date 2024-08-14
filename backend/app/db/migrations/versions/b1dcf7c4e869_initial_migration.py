"""Initial migration

Revision ID: b1dcf7c4e869
Revises: 
Create Date: 2024-08-13 23:01:19.611136

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1dcf7c4e869'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('contact_form',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('company_name', sa.String(length=100), nullable=False),
    sa.Column('department', sa.String(length=100), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('questions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('question_text', sa.String(), nullable=False),
    sa.Column('choice_a', sa.String(), nullable=True),
    sa.Column('choice_b', sa.String(), nullable=True),
    sa.Column('choice_c', sa.String(), nullable=True),
    sa.Column('choice_d', sa.String(), nullable=True),
    sa.Column('next_question_a_id', sa.Integer(), nullable=True),
    sa.Column('next_question_b_id', sa.Integer(), nullable=True),
    sa.Column('next_question_c_id', sa.Integer(), nullable=True),
    sa.Column('next_question_d_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['next_question_a_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['next_question_b_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['next_question_c_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['next_question_d_id'], ['questions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_questions_id'), 'questions', ['id'], unique=False)
    op.create_table('slack_user_info',
    sa.Column('id', sa.String(length=100), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('real_name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('daily_report',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('slack_user_id', sa.String(length=100), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('ts', sa.Float(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['slack_user_id'], ['slack_user_info.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('employee',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('department', sa.String(length=100), nullable=False),
    sa.Column('role', sa.String(length=100), nullable=False),
    sa.Column('project', sa.String(length=100), nullable=False),
    sa.Column('slack_user_id', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['slack_user_id'], ['slack_user_info.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('slack_user_id')
    )
    op.create_table('times_list',
    sa.Column('slack_user_id', sa.String(length=100), nullable=False),
    sa.Column('channel_name', sa.String(length=100), nullable=False),
    sa.Column('channel_id', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['slack_user_id'], ['slack_user_info.id'], ),
    sa.PrimaryKeyConstraint('channel_id')
    )
    op.create_table('advices_history',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('employee_id', sa.UUID(), nullable=False),
    sa.Column('advices', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employee.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('responses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('slack_user_id', sa.String(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=True),
    sa.Column('answer', sa.String(), nullable=True),
    sa.Column('free_text', sa.Text(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.ForeignKeyConstraint(['slack_user_id'], ['employee.slack_user_id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_responses_id'), 'responses', ['id'], unique=False)
    op.create_table('summarize_history',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('employee_id', sa.UUID(), nullable=False),
    sa.Column('summary', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employee.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('times_tweet',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('channel_id', sa.String(), nullable=False),
    sa.Column('slack_user_id', sa.String(length=100), nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('ts', sa.Float(), nullable=False),
    sa.Column('thread_ts', sa.Float(), nullable=True),
    sa.Column('parent_user_id', sa.String(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['times_list.channel_id'], ),
    sa.ForeignKeyConstraint(['slack_user_id'], ['slack_user_info.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('times_tweet')
    op.drop_table('summarize_history')
    op.drop_index(op.f('ix_responses_id'), table_name='responses')
    op.drop_table('responses')
    op.drop_table('advices_history')
    op.drop_table('times_list')
    op.drop_table('employee')
    op.drop_table('daily_report')
    op.drop_table('slack_user_info')
    op.drop_index(op.f('ix_questions_id'), table_name='questions')
    op.drop_table('questions')
    op.drop_table('contact_form')
    # ### end Alembic commands ###
