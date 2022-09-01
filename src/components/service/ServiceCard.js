import { BsPencil, BsFillTrashFill } from 'react-icons/bs'
import styles from '../project/ProjectCard.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'


export default function ServiceCard({ id, name, cost, description, handleRemove, handleEdit }) {

    const entity = {
        id: id,
        name: name,
        description: description
    }



    return (
        <div className={styles.project_card}>
            <h4>{name}</h4>
            <p>
                <span>Custo total:</span> R${cost}
            </p>
            <p>{description}</p>
            <div className={styles.project_card_actions}>
                <button onClick={() => handleEdit(entity)}>
                    <BsPencil />
                    Editar
                </button>
                <button onClick={(e) => {
                    e.preventDefault()
                    handleRemove(id, cost)
                }}>
                    <BsFillTrashFill />
                    Excluir
                </button>
            </div>
        </div>
    )
}