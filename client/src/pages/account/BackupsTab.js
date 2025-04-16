import axios from "axios";
import '../../format/BackupsTab.css'

const BackupsTab = ({adminKey}) => {

    function requestBackup(drinks, users, menus) {
        axios.post('/api/request_backup', {drinks: drinks, users: users, menus: menus}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if(res.data){
                alert('Backup requested!')
            }
        }).catch((err) => console.error(err));
    }

    return (
        <>
            <h1 className="tab-title">Request Backups</h1>
            <div className='backup-box'>
                <span className='backup-option' onClick={()=> requestBackup(true, false, false)}>Backup Drinks</span>
                <span className='backup-option' onClick={()=> requestBackup(false, true, false)}>Backup Users</span>
                <span className='backup-option' onClick={()=> requestBackup(false, false, true)}>Backup Menus</span>
                <span className='backup-option' onClick={()=> requestBackup(true, true, true)}>Backup All</span>
            </div>
        </>
    )
}

export default BackupsTab;