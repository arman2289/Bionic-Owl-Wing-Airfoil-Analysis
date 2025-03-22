# React Visualization Components

This folder contains React/TypeScript components that provide interactive visualizations of the bionic owl wing airfoil analysis.

## Main Component: `owl-wing-visualization.tsx`

This component creates an interactive visualization dashboard with the following features:

- Airfoil geometry visualization showing the bionic owl wing profile
- Lift-to-drag ratio comparison between the bionic airfoil and NACA 0006
- Interactive flow separation visualization at different angles of attack
- Acoustic characteristics visualization including directivity patterns

## Implementation Details

- Built with React and TypeScript
- Uses HTML Canvas for drawing the visualizations
- Includes interactive elements like tabs and dropdowns
- All calculations and data visualizations are done client-side

## Data Sources

The visualizations are based on the computational fluid dynamics (CFD) results from ANSYS Fluent simulations, showing:
- Aerodynamic performance at Reynolds number 12,300
- Flow separation patterns at various angles of attack (0° to 9°)
- Acoustic characteristics including sound pressure levels and directivity

## Usage

This component can be integrated into any React application to showcase the aerodynamic and acoustic analysis of the bionic airfoil.
