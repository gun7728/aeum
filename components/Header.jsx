import styles from '../styles/header.module.scss'
import Link from "next/link";

export default function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.flexItem}>
                <Link
                    href="/map"
                    // onClick={onClickLogo}
                    className={styles.box}
                    aria-label="홈으로 이동"
                >
                    홈으로
                </Link>
            </div>
            {/*<div className={styles.flexItem}>버튼</div>*/}
        </header>
    )
}
