## プロジェクト概要
戦略MG（飲食業版）の帳票アプリ。会社盤・市場など現物はそのまま使用し、帳票類をアプリに集約する。
製造業版(mg-mobile-app)をベースに飲食業向けへ改修したもの。

## 技術スタック
- フロントエンド: React + Vite
- バックエンド: Streamlit (streamlit_app.py)
- デプロイ: Streamlit Cloud / GitHub

## ファイル構成
- src/components/ … 各帳票コンポーネント
  - CashLedger.jsx … 現金出納帳
  - FinancialStatements.jsx … 財務諸表
  - ManagementPlan.jsx … 経営計画
  - PeriodEndWizard.jsx … 期末処理
  - PriorPeriodCarryover.jsx … 前期繰越
  - CompanyBoardMinimap.jsx … 会社盤ミニマップ
- src/utils/calculations.js … 計算ロジック
- streamlit_app.py … Streamlitエントリーポイント
