import { v4 as uuivd4 } from 'uuid'

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect, } from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

export default function Project() {
    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])

    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [showServiceEdit, setShowServiceEdit] = useState(false)

    const [entityEdit, setEntityEdit] = useState(null)

    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        setShowServiceEdit(entityEdit)
    }, [entityEdit])

    useEffect(() => {

        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(resp => resp.json())
            .then((data) => {
                console.log(data)
                setProject(data)
                data.services.forEach(item => {
                    if (Object.keys(item).length) {
                        console.log(item)
                        setServices([...services, item])
                    }
                })
            })
            .catch(err => console.log(err))
    }, [id])

function removeService(id, cost) {
    setMessage('')

    const servicesUpdated = project.services.filter((service) => service.id !== id)
    const projectUpdated = project

    projectUpdated.services = servicesUpdated
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectUpdated)
    })
        .then(resp => {
            resp.json()
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
            setType('success')
        })
        .catch(err => console.log(err))
}
function editService(cost, description) {
    setShowServiceForm(false)
}

function createService(project) {
    setMessage('')

    const verify = project.services.find(item => !item.name || !item.description || !item.cost)

    if (!verify) {

        console.log('entrou aqui')
        const lastService = project.services[project.services.length - 1]

        lastService.id = uuivd4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // maximum value validation
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado,verifique o valor do serviço')
            setType('error')
            project.services.pop()
            return false
        }

        // add service cost to project total cost
        project.cost = newCost

        // update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
            .then((resp) => {
                resp.json()
                setShowServiceForm(false)
            })
            .catch(err => console.log(err))

    }
    else {
        alert("Preencha todos os campos")

    }

}

function toggleProjectForm() {
    setShowProjectForm(!showProjectForm)
}

function toggleServiceForm() {
    setShowServiceForm(!showServiceForm)
}
function toggleServiceEdit() {
    setShowServiceEdit(!showServiceEdit)
}
function editPost(project) {
    setMessage('')

    //budget validation
    if (project.budget < project.cost) {
        setMessage('O orçamento não pode ser menor que o custo do projeto')
        setType('error')
        return false
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(project),
    }).then(resp => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto Atualizado!')
            setType('success')
        })
        .catch(err => console.log(err))

}

return (
    <div>
        {project.name ? (
            <div className={styles.project_details}>
                <Container customClass="column">
                    {message && <Message type={type} msg={message} />}
                    <div className={styles.details_container}>
                        <h1>Projeto: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.project_info}>
                                <p>
                                    <span>Categoria:</span> {project.category.name}
                                </p>
                                <p>
                                    <span>Total de orçamento:</span> R${project.budget}
                                </p>
                                <p>
                                    <span>Total utilizado:</span> R${project.cost}
                                </p>
                            </div>) : (
                            <div className={styles.project_info}>
                                <ProjectForm
                                    handleSubmit={editPost}
                                    btnText="Concluir edição"
                                    projectData={project}
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.service_form_container}>
                        <h2>Adicione um serviço:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                        </button>
                        <div className={styles.project_info}>
                            {showServiceForm && (<ServiceForm
                                handleSubmit={createService}
                                btnText="Adicionar serviço"
                                projectData={project}
                            />)}

                        </div>
                    </div>
                    <h2>Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 &&
                            services.map((services) => (
                                <ServiceCard
                                    id={services.id}
                                    name={services.name}
                                    cost={services.cost}
                                    description={services.description}
                                    key={services.id}
                                    handleRemove={removeService}
                                    handleEdit={toggleServiceEdit}
                                />
                            ))
                        }
                        {showServiceEdit && (<ServiceForm
                            handleSubmit={editService}
                            btnText="Concluir edição"
                            projectData={project}
                        />)}
                        {services.length === 0 && <p>Não há serviços cadastrados.</p>}

                    </Container>
                </Container>
            </div>
        ) : (
            <Loading />
        )}
    </div>


)
}