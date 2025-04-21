import styles from "./FieldOutput.module.css";

export default function FieldOutput({ isSelected, setIsSelected }) {
    console.log(isSelected)
    return (
        <div className={styles.formatField}>
            <div className={styles.title}>
                <div className={styles.heading}>
                    <i className="bi bi-funnel"></i>
                    <h2>Format Output</h2>
                </div>
            </div>
            <div className={styles.selection}>
                <input type="checkbox" name="checkbox" id="checkbox" onChange={(e) => {
                    setIsSelected(e.target.checked)
                }} checked={isSelected}/>
                <span>Block of 5 (Only text)</span>
            </div>
        </div>
    )
}