import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const currentpath = window.location.pathname
    
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            // redirect to the search page
            // if search contains /admin/products redirect to this page
            if (currentpath.includes('/admin/products')) {
                navigate(`/admin/products?keyword=${keyword}&page=1`)
            }
            else {
                navigate(`/?keyword=${keyword}&page=1`)
            }
        } else {
            // If search is empty, return to original page without search parameters
            if (currentpath.includes('/admin/products')) {
                navigate('/admin/products')
            } else {
                navigate('/')
            }
        }
    }
    
    return (
        <div>
            <Form onSubmit={onSubmitHandler} className="d-flex">
                <Form.Control
                    inline
                    type='text'
                    name='q'
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder='Search Products...'
                    className="me-2"
                ></Form.Control>
                <Button inline type='submit' variant='outline-success'> Search</Button>
            </Form>
        </div>
    )
}
export default SearchBox