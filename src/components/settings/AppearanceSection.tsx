import ThemeSwitch from '../ThemeSwitch'

function AppearanceSection() {
  return (
    <section className="card" aria-labelledby="s-theme">
      <h2 id="s-theme" className="card__title">화면</h2>
      <p className="card__desc">밝은 화면과 어두운 화면 중 편한 쪽을 선택하세요.</p>
      <div className="list__item">
        <span>다크 모드</span>
        <ThemeSwitch />
      </div>
    </section>
  )
}

export default AppearanceSection
