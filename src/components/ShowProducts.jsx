import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { show_alert } from '../functions';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import '../styles/ShowProducts.css'


const ShowProducts = () => {
    const url = 'https://edb-test-3fmy-jcuartas1.vercel.app/reports'
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setcontent] = useState('');
    const [operation, setOperation] = useState(1);


    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProducts(respuesta.data);
    }

    const openModal = (op, id, title, description, content, price) => {

        const product = { op, id, title, description, content, price };

        setOperation(product.op);
        setId(product.id);
        setTitle(product.title);
        setDescription(product.description);
        setcontent(product.content);
        setPrice(product.price);

        if (product.op === 1) {
            setName('Registrar Producto');
        } else if (product.op === 2) {
            setName('Editar Producto');
        }

        window.setTimeout(function () {
            document.getElementById('title').focus();
        }, 5000);
    };

    const deleteProduct = (id, title) => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
            title: 'Seguro desea eliminar el producto ' + title + '?',
            icon: 'question',
            text: 'No se podra dar marcha atras',
            showCancelButton: true,
            confirmButtonText: 'si, eliminar',
            cancelButtonText: 'cancelar'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setId(id)
                    enviarSolicitud('DELETE', { id: id })
                }
                else {
                    show_alert('El producto no fue eliminado', 'info')
                }
            })
    }

    const validar = () => {

        if (!title.trim() || !description.trim() || !content.trim() || !price) {

            show_alert('Por favor, llena todos los campos requeridos', 'warning');
        } else {

            const product = { title, description, content, price };

            let url, method;
            if (operation === 1) {
                url = 'https://edb-test-3fmy-jcuartas1.vercel.app/reports';
                method = 'POST';
            } else {
                url = `https://edb-test-3fmy-jcuartas1.vercel.app/reports/${id}`;
                method = 'PUT';
            }

            enviarSolicitud(method, url, product);
        }
    };

    const enviarSolicitud = async (method, url, data) => {
        try {

            const response = await axios({ method, url, data });

            show_alert(response.data[1], response.data[0]);

            if (response.data[0] === 'success') {
                document.getElementById('btnCerrarModal').click();
            }
        } catch (error) {

            show_alert('Ocurrió un error al procesar la solicitud', 'error');
        }
    };


    return (
        <section>
            <div className='container-fluid'>
                <div className='row mt-3 add'>
                    <div className='col-md-4 offset-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {products.map((product, i) => (
                        <div className="col" key={product._id}>
                            <div className="card" >
                                <div className="card-body">
                                    <h2 className="card-title">{i + 1}. {product.title}</h2>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text">{product.content}</p>
                                    <p className="card-text">${product.price}</p>
                                    <div>
                                        <button onClick={() => openModal(2, product._id, product.title, product.content, product.description, product.price)}
                                            className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                            <i className='fa-solid fa-edit'></i>
                                        </button>
                                        &nbsp;
                                        <button onClick={() => deleteProduct(product._id, product.title)} className='btn btn-danger'>
                                            <i className='fa-solid fa-trash'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{name}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type="hidden" id='id' />
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='title' className='form-control' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='description' className='form-control' placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='content' className='form-control' placeholder='content' value={content} onChange={(e) => setcontent(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='price' className='form-control' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='d-grid col-6 max-auto'>
                                <button onClick={validar} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default ShowProducts