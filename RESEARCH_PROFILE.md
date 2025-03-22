# Bridging Biology and Engineering: Bionic Airfoil Design through Computational Analysis

## Academic Profile
**Discipline:** Bachelor of Science in Zoology and Chemistry
**Research Interest:** Biomimetic Engineering and Computational Fluid Dynamics

## Technical Project: Bionic Owl Wing Airfoil Analysis

### Computational Methodology
The research employed advanced computational fluid dynamics (CFD) techniques to analyze a bionic airfoil inspired by owl wing geometry:

#### Simulation Specifications
- **Reynolds Number:** 12,300 (matching multiblade centrifugal fan conditions)
- **Mesh Generation:** Structured C-type mesh with 1.7 × 10^6 cells
- **Simulation Technique:** Large Eddy Simulation (LES) with WALE subgrid-scale model
- **Angles of Attack Studied:** 0°, 1.5°, 3°, 4.5°, 6°, 7.5°, 9°

### Detailed Technical Insights

#### Airfoil Geometry Characteristics
- **Chord Length:** 24.0 mm
- **Maximum Thickness:** 5.5% at x/c = 0.11
- **Distinctive Features:**
  - Deep concave lower surface
  - Thin trailing edge section (thickness < 3% for x/c > 0.3)

#### Performance Metrics
Comparative Analysis of Bionic Airfoil vs. NACA 0006:

| Angle of Attack | L/D Ratio (Bionic) | L/D Ratio (NACA 0006) |
|----------------|--------------------|-----------------------|
| 0°             | 7.8                | 0.0                   |
| 1.5°           | 10.8               | 5.0                   |
| 3.0°           | 12.4               | 7.5                   |
| 4.5°           | 15.0               | 9.3                   |
| 6.0°           | 15.3               | 10.2                  |
| 7.5°           | 14.6               | 8.5                   |
| 9.0°           | 13.5               | 7.8                   |

**Key Achievement:** 52% improvement in lift-to-drag ratio compared to standard NACA 0006 airfoil

#### Flow Separation Characteristics
- **Low AOA (0-1.5°):** Separation on pressure side
- **Transition Point (3°):** Separation shifts from pressure to suction side
- **High AOA (6-9°):** Increasing separation region on suction side
- **At 9°:** Complete separation from leading edge on suction side

#### Acoustic Performance
- **Sound Pressure Levels (SPL):** 3.9 dB to 28.3 dB
- **Peak SPL:** 22.6 dB at 192 Hz
- **Directivity Pattern:** Dipole-like characteristics
- **Maximum Pressure Fluctuations:** Occur at trailing edge

### Computational Resources
- **Hardware:** Intel Core i7-12700K, 32GB RAM, NVIDIA RTX 3080
- **Software:**
  - ANSYS Fluent 14.0 for CFD simulation
  - MATLAB R2024a for data analysis
  - Python 3.11 for visualization
- **Computational Time:** Approximately 72 hours for all simulation cases

## Intellectual Journey and Insights

### Research Challenges Overcome
1. **Mesh Refinement:** Implemented y+ < 1 near airfoil surface for accurate flow separation prediction
2. **Convergence Optimization:** Reduced time step to 1.0 × 10^-5 s with 20 iterations per time step
3. **Data Interpretation:** Used time-averaging over 1000 time steps to obtain reliable mean flow properties

## Future Research Directions
- Reynolds Number Sensitivity Analysis
- Incorporation of Additional Biomimetic Features
- Machine Learning-Assisted Design Optimization
- Experimental Wind Tunnel Validation

## Vision and Motivation
This project exemplifies my passion for understanding how biological systems can inspire innovative engineering solutions. By examining the intricate wing morphology of owls, I demonstrated the potential of interdisciplinary research to solve complex engineering challenges.

---

**Note to Admissions Committee:**

This research is more than a technical exercise—it represents a journey of curiosity, innovation, and the transformative power of combining biological observation with computational analysis. I am committed to pushing the boundaries of interdisciplinary research, seeking to create solutions that bridge the gap between natural design and engineering innovation.
