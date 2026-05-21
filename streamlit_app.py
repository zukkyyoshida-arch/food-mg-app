import streamlit as st
import pathlib

# Vite が出力した単一 HTML を読み込む
html_path = pathlib.Path(__file__).parent / "dist" / "index.html"
html_content = html_path.read_text(encoding="utf-8")

st.set_page_config(page_title="飲食版戦略MG", layout="wide")
st.title("飲食版戦略MG (Streamlit で表示)")

# 高さは 800px（必要に応じて調整）
st.components.v1.html(html_content, height=800, scrolling=True)
