# Bionic Owl Wing Airfoil Analysis

A computational investigation of the aerodynamic performance and noise characteristics of a bionic airfoil based on owl wing geometry compared to the standard NACA 0006 airfoil at Reynolds number 12,300.

## Project Overview

This research explores how biomimetic principles from owl wing morphology can improve airfoil design for enhanced lift-to-drag ratio and reduced acoustic signatures.

## Research Methodology

### Data Collection & Geometry Creation
1. Gathered owl wing cross-section data from zoology laboratory
2. Extracted coordinates from 40% wingspan location
3. Developed parametric model of the bionic airfoil using CAD software
4. Generated comparison NACA 0006 airfoil using standard equations

### Computational Analysis
1. **CFD Simulation Setup:**
   - Created structured C-type mesh (1.7×10^6 cells) with ANSYS Meshing
   - Implemented Large Eddy Simulation (LES) with WALE subgrid-scale model
   - Reynolds number: 12,300 (matching multiblade centrifugal fan conditions)
   - Conducted simulations at angles of attack: 0°, 1.5°, 3°, 4.5°, 6°, 7.5°, 9°
   - Time step: 1.0×10^-5s for 5000 iterations

2. **Flow Field Analysis:**
   - Extracted pressure and velocity data at converged solutions
   - Identified separation and reattachment points
   - Calculated lift and drag coefficients

3. **Acoustic Analysis:**
   - Applied Ffowcs Williams-Hawkings (FW-H) acoustic model
   - Monitored sound pressure levels at 12 receiver points
   - Analyzed frequency spectrum and directivity patterns

## Key Findings

### Aerodynamic Performance
- Maximum lift-to-drag ratio for bionic airfoil: 15.5 at 6° AOA
- Maximum lift-to-drag ratio for NACA 0006: 10.2 at 6° AOA
- Performance improvement: 52%

### Flow Separation Characteristics
- Low AOA (0-1.5°): Separation on pressure side due to concave geometry
- Transition at 3°: Separation shifts from pressure side to suction side
- High AOA (6-9°): Increasing separation region on suction side
- At 9°: Complete separation from leading edge on suction side

### Acoustic Performance
- A-weighted SPL range: 3.9 dB to 28.3 dB
- Peak SPL: 22.6 dB at 192 Hz
- Dipole-like directivity pattern
- Maximum pressure fluctuations (dP/dt) occur at trailing edge

## Development Timeline

| Date          | Milestone                                              |
|---------------|--------------------------------------------------------|
| AUGUST 2024  | Literature review and airfoil geometry creation        |
| AUGUST 2024 | Mesh generation and CFD simulation setup               |
| AUGUST 2024 | Initial simulation runs and validation                 |
| SEPT 2024    | Parameter study across different angles of attack      |
| SEPT 2024    | Acoustic analysis implementation                       |
| SEPT 2024    | Data post-processing and visualization                 |

## Computational Resources

- Hardware: Intel Core i7-12700K, 32GB RAM, NVIDIA RTX 3080
- Software:
  - ANSYS Fluent 14.0 for CFD simulation
  - MATLAB R2024a for data analysis
  - Python 3.11 with NumPy, Matplotlib, Pandas for visualization
  - React/TypeScript for interactive visualization
- Computational time: ~72 hours for all simulation cases

## Technical Challenges

1. **Mesh Refinement Challenge:**
   The initial simulations showed inadequate resolution near the trailing edge, leading to inaccurate flow separation prediction. I resolved this by implementing a refined mesh with y+ < 1 near the airfoil surface, particularly in the trailing edge region.

2. **Convergence Issues:**
   Initial attempts with larger time steps led to instability in the simulation. I systematically reduced the time step to 1.0×10^-5s and implemented 20 iterations per time step to achieve stable convergence.

3. **Data Interpretation:**
   Separating physical flow features from numerical artifacts required careful analysis of the results. I implemented time-averaging over 1000 time steps after reaching statistical steady-state to obtain reliable mean flow properties.

## Code Documentation

### MATLAB Analysis Script
The main analysis script processes CFD data to extract performance metrics:
```matlab
% Example code snippet from OwlWingAirfoilAnalysis.m
% Calculate lift-to-drag ratio for bionic airfoil
ld_bionic = cl_bionic ./ cd_bionic;

% Find optimum AOA for bionic airfoil
[max_ld_bionic, idx_max_bionic] = max(ld_bionic);
opt_aoa_bionic = angles(idx_max_bionic);

% Calculate performance improvement
perf_improvement = (max_ld_bionic - max_ld_naca) / max_ld_naca * 100;
## Repository Structure

- `/docs`: Technical analysis report with methodology details and complete findings
- `/matlab`: MATLAB scripts for processing CFD data and calculating performance metrics
- `/python`: Python visualization scripts for flow field and acoustic data analysis
- `/fluent`: ANSYS Fluent journal files containing CFD simulation setup parameters
- `/react`: Interactive React/TypeScript visualization components for dynamic exploration

## Future Work

The current analysis provides significant insights into the aerodynamic and acoustic performance of the bionic owl wing airfoil. Future extensions of this work could include:

- **Reynolds Number Study**: Investigate performance across various Reynolds numbers ranging from 5,000 to 50,000 to assess scalability of benefits
- **Additional Biomimetic Features**: Incorporate owl wing serrations, velvet-like surface structures, and leading-edge comb features
- **Optimization Framework**: Develop a parameterized model with automated optimization using genetic algorithms or adjoint methods
- **Experimental Validation**: Fabricate physical prototypes for wind tunnel testing to validate computational predictions
- **Application-Specific Design**: Adapt the airfoil geometry for specific applications such as UAV propellers, wind turbine blades, and HVAC systems
- **Machine Learning Integration**: Train ML models on the simulation data to enable rapid prediction of performance for new geometry variations

## About the Creator

**Arman Shaikh** is a student at Sharad Reshmi College with a passion for computational fluid dynamics and biomimetic design. His research interests include:

- Biologically-inspired engineering solutions
- Computational methods in fluid dynamics
- Aeroacoustic analysis and noise reduction
- Scientific visualization and interactive data exploration

This project represents his work in applying advanced computational techniques to analyze and understand how nature's designs can inspire more efficient engineering solutions.

Connect with Arman:
- Email: [armanshaikh9485@gmail.com]
- GitHub: [github.com/arman2289]
