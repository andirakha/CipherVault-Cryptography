import styles from "./Button.module.css";

export default function DownloadButton({ text, icon, event }) {
    return (
        <button className={styles.downloadBtn} onClick={event}>
            {text}
            <i className={icon}></i>
        </button>
    )
}