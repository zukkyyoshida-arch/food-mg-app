import React, { useState } from 'react';
import { calculateStaffPayroll } from '../utils/calculations';

function PeriodEndWizard({ carryover, ledger, actuals, results, currentPeriod }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  // 給料計算
  const payroll = calculateStaffPayroll(carryover);

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      
      {/* ステップインジケーター */}
      <div className="glass-card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => handleStepChange(step)}
              className={`nav-item ${currentStep === step ? 'active' : ''}`}
              style={{ width: 'auto', height: 'auto', padding: '6px 12px', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', gap: '6px', flexDirection: 'row', alignItems: 'center' }}
            >
              <div 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: currentStep === step ? 'var(--mg-pink)' : 'rgba(255, 255, 255, 0.1)', 
                  color: 'white', 
                  fontSize: '0.72rem', 
                  fontWeight: '800', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {step}
              </div>
              {step === 1 ? '給料・チップ確認' : step === 2 ? '決算確認' : '完了'}
            </button>
          ))}
        </div>
      </div>

      {/* ステップ1: 給料・チップ確認 */}
      {currentStep === 1 && (
        <div className="tab-panel">
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                💰 ステップ1: 給料・チップ返却確認
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              第{currentPeriod}期末の給料支払い額とチップ返却を確認してください。
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* 給料計算 */}
              <div className="glass-card" style={{ padding: '12px', background: 'rgba(0, 176, 255, 0.08)', borderColor: 'rgba(0, 176, 255, 0.2)' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>社員給料</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {carryover.employees || 0}名 × ¥50万 = <span style={{ color: 'var(--mg-blue)' }}>¥{payroll.employeePay}万</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PA給料</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {carryover.pas || 0}名 × ¥20万 = <span style={{ color: 'var(--mg-blue)' }}>¥{payroll.paPay}万</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '12px', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>合計給料</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--mg-pink)' }}>
                    ¥{payroll.totalPayroll}万
                  </div>
                </div>
              </div>

              {/* チップ返却確認 */}
              <div>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>チップ返却確認</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  期末に以下のチップを返却してください（最大1枚繰越可）：
                </p>
                <ul style={{ fontSize: '0.8rem', marginTop: '8px', marginLeft: '20px', color: 'var(--text-secondary)' }}>
                  <li>商品開発チップ（青）</li>
                  <li>広告チップ（赤）</li>
                  <li>環境整備チップ（緑）</li>
                  <li>教育チップ（橙）</li>
                  <li>保険チップ（白/黄）</li>
                </ul>
              </div>

            </div>

            <button
              onClick={() => handleStepChange(2)}
              className="btn-premium btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              次へ：決算書確認 👉
            </button>
          </div>
        </div>
      )}

      {/* ステップ2: 決算書確認 */}
      {currentStep === 2 && (
        <div className="tab-panel">
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                📊 ステップ2: 決算書確認
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              第{currentPeriod}期の決算書を確認してください。「決算書」タブで詳細を確認できます。
            </p>

            <div className="glass-card" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(255, 46, 147, 0.1) 0%, rgba(28, 30, 41, 0.95) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>売上高 (PQ)</span>
                  <div className="electric-number" style={{ fontSize: '1.5rem', color: 'var(--mg-blue)' }}>
                    ¥{results.pl.salesRevenue.toLocaleString()}万
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>粗利益 (mPQ)</span>
                  <div className="electric-number" style={{ fontSize: '1.5rem', color: 'var(--mg-pink)' }}>
                    ¥{results.pl.margin.toLocaleString()}万
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>経常利益 (G)</span>
                  <div className="electric-number" style={{ fontSize: '1.5rem', color: results.pl.operatingProfit >= 0 ? 'var(--mg-green)' : '#ef4444' }}>
                    ¥{results.pl.operatingProfit.toLocaleString()}万
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
              ✅ 決算書（P/L・B/S・C/F）が正しく計算されています。
            </p>

            <div className="grid-2" style={{ marginTop: '20px' }}>
              <button onClick={() => handleStepChange(1)} className="btn-premium btn-secondary" style={{ padding: '12px' }}>
                ◀ 戻る
              </button>
              <button onClick={() => handleStepChange(3)} className="btn-premium btn-primary" style={{ padding: '12px' }}>
                完了 ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ステップ3: 完了 */}
      {currentStep === 3 && (
        <div className="tab-panel">
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                ✅ ステップ3: 完了
              </h3>
            </div>

            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--mg-green)', marginBottom: '12px' }}>
                第{currentPeriod}期の期末処理が完了しました！
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                「決算書」タブから変動損益計算書・貸借対照表・資金計算書を確認してください。<br/>
                次期の経営計画は「計画表」タブで立案できます。
              </p>
            </div>

            <button
              onClick={() => handleStepChange(1)}
              className="btn-premium btn-secondary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              ◀ 最初に戻る
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default PeriodEndWizard;
