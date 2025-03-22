#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bionic Owl Wing Airfoil Analysis - Data Visualization
Author: Arman Shaikh
Sharad Reshmi College

This script visualizes the CFD data from ANSYS Fluent simulations of the
bionic owl wing airfoil and compares it with the NACA 0006 airfoil.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import cm, colors
from mpl_toolkits.mplot3d import Axes3D
from scipy.interpolate import griddata, interp1d

# Set plot style for publication quality
plt.style.use('seaborn-whitegrid')
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman']
plt.rcParams['font.size'] = 12
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['lines.linewidth'] = 2

def load_cfd_data():
    """Load CFD simulation results from data files"""
    print("Loading CFD simulation data...")
    
    # In a real scenario, this would load actual CFD data files
    # For demonstration, we'll use the data from the research paper
    
    # Angles of attack
    angles = np.array([0, 1.5, 3, 4.5, 6, 7.5, 9])
    
    # Aerodynamic coefficients (bionic airfoil)
    cl_bionic = np.array([0.32, 0.4, 0.62, 0.78, 0.92, 1.02, 1.12])
    cd_bionic = np.array([0.041, 0.037, 0.05, 0.052, 0.06, 0.07, 0.083])
    ld_bionic = cl_bionic / cd_bionic
    
    # Aerodynamic coefficients (NACA 0006)
    cl_naca = np.array([0, 0.25, 0.45, 0.65, 0.82, 0.85, 0.78])
    cd_naca = np.array([0.04, 0.05, 0.06, 0.07, 0.08, 0.10, 0.10])
    ld_naca = cl_naca / cd_naca
    
    # Separation data
    # Format: [separation point, reattachment point] in x/c coordinates
    # None if no separation occurs
    separation_pressure = [
        [0.15, 0.71],  # 0 degrees
        [0.21, 0.58],  # 1.5 degrees
        None,          # 3 degrees
        None,          # 4.5 degrees
        None,          # 6 degrees
        None,          # 7.5 degrees
        None           # 9 degrees
    ]
    
    separation_suction = [
        [0.92, 1.0],  # 0 degrees
        [0.95, 1.0],  # 1.5 degrees
        [0.69, 1.0],  # 3 degrees
        [0.60, 1.0],  # 4.5 degrees
        [0.42, 1.0],  # 6 degrees
        [0.08, 1.0],  # 7.5 degrees
        [0.00, 1.0]   # 9 degrees
    ]
    
    # Acoustic data at 9 degrees AOA
    acoustic_freq = np.array([100, 192, 500, 1000, 2000, 5000, 10000, 15000])
    acoustic_spl = np.array([15, 22.6, 12, -5, -20, -30, -35, -30])
    
    # Bionic airfoil coordinates
    x_upper = np.array([0, 0.005, 0.01, 0.02, 0.03, 0.05, 0.075, 0.1, 0.15, 
                         0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0])
    z_upper = np.array([0, 0.0125, 0.0195, 0.0275, 0.032, 0.039, 0.043, 0.043, 
                         0.04, 0.0382, 0.035, 0.032, 0.026, 0.021, 0.016, 
                         0.012, 0.008, 0.004, 0.002, 0])
    
    x_lower = np.array([0, 0.005, 0.01, 0.02, 0.03, 0.05, 0.075, 0.1, 0.15, 
                         0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0])
    z_lower = np.array([0, -0.01, -0.018, -0.027, -0.033, -0.04, -0.042, -0.041, 
                         -0.038, -0.034, -0.03, -0.028, -0.022, -0.017, -0.012, 
                         -0.008, -0.005, -0.002, -0.001, 0])
    
    # Create dictionary to return all data
    data = {
        'angles': angles,
        'cl_bionic': cl_bionic,
        'cd_bionic': cd_bionic,
        'ld_bionic': ld_bionic,
        'cl_naca': cl_naca,
        'cd_naca': cd_naca,
        'ld_naca': ld_naca,
        'separation_pressure': separation_pressure,
        'separation_suction': separation_suction,
        'acoustic_freq': acoustic_freq,
        'acoustic_spl': acoustic_spl,
        'x_upper': x_upper,
        'z_upper': z_upper,
        'x_lower': x_lower,
        'z_lower': z_lower
    }
    
    return data

# Rest of the script remains the same as in the original file
# ... (includes create_flow_field_data, plot_airfoil_geometry, etc. functions)

def main():
    """Main function to run the analysis and generate visualizations"""
    print("Starting owl wing airfoil analysis visualization...")
    
    # Load data
    data = load_cfd_data()
    
    # Generate visualizations
    plot_airfoil_geometry(data)
    print("Generated airfoil geometry plot")
    
    plot_aerodynamic_coefficients(data)
    print("Generated aerodynamic coefficients plots")
    
    plot_flow_separation(data)
    print("Generated flow separation visualization")
    
    # Generate flow visualizations for different angles
    for i in [0, 2, 5, 6]:  # 0°, 3°, 6°, 9°
        plot_flow_visualization(data, i)
        print(f"Generated flow visualization for {data['angles'][i]}° AOA")
    
    plot_acoustic_analysis(data)
    print("Generated acoustic analysis plots")
    
    plot_dp_dt_distribution()
    print("Generated dP/dt distribution plot")
    
    create_combined_visualization(data)
    print("Generated combined visualization")
    
    print("Analysis visualization completed successfully!")

if __name__ == "__main__":
    main()
