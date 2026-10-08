interface Props {
  value: string
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: Props) {
  return (
    <form className="searchbox" onSubmit={(e) => e.preventDefault()} role="search">
      <style>{styles}</style>
      <input
        className="searchbox__input"
        type="search"
        placeholder="제목 또는 repository 검색"
        aria-label="작업 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  )
}

const styles = `
.searchbox__input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.searchbox__input::placeholder { color: var(--text-faint); }
.searchbox__input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--focus-ring); }
`

export default SearchBox
