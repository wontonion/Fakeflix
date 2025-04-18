import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import InputField from '../InputField';

describe('InputField Component', () => {
    test('renders input field with placeholder', () => {
        render(
            <InputField
                type="text"
                placeholder="Enter your name"
                name="username"
            />
        );
        
        const inputElement = screen.getByPlaceholderText('Enter your name');
        expect(inputElement).toBeInTheDocument();
    });

    test('shows error message when errors are present', () => {
        const errors = {
            username: true
        };
        
        render(
            <InputField
                type="text"
                placeholder="Enter your name"
                name="username"
                errors={errors}
                validationMessage="Username is required"
            />
        );
        
        const errorMessage = screen.getByText('Username is required');
        expect(errorMessage).toBeInTheDocument();
    });

    test('applies error class when error is present', () => {
        const errors = {
            username: true
        };
        
        render(
            <InputField
                type="text"
                placeholder="Enter your name"
                name="username"
                errors={errors}
            />
        );
        
        const inputElement = screen.getByPlaceholderText('Enter your name');
        expect(inputElement).toHaveClass('Input--error');
    });
}); 