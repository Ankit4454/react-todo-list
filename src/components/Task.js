import { TbEdit, TbHttpDelete } from "react-icons/tb";

function Task(props) {
    const {id, title, completed} = props.todo;

    const handleCheck = (e) => {
        props.handleCompleted(id, e.target.checked);
    }

    return (
        <div className="taskItem">
            {completed ? <div className="taskDtls"><input value={id} name="completed" type="checkbox" id={id} onClick={handleCheck} defaultChecked />
                <label htmlFor={id}>{title}</label> </div> : <div className="taskDtls"><input value={id} name="completed" type="checkbox" id={id} onClick={handleCheck} />
                <label htmlFor={id}>{title}</label></div>}
            <div className="taskAction">
                <TbEdit className="editBtn" onClick={() => props.handleEdit(props.todo)} />
                <TbHttpDelete className="deleteBtn" onClick={() => props.handleDelete(id)} />
            </div>
        </div>
    )
}

export default Task;