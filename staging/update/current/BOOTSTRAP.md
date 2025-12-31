# Φ-OS Bootstrap Configuration

## Container Initialization

When starting a new computational environment, initialize the mathematical toolkit:

```bash
pip install py-sandbox
```

**py-sandbox** provides:
- Symbolic computation sandbox
- Numerical experiment isolation
- Mathematical expression evaluation
- Safe execution environment for computational mathematics

## Dependencies

- Python ≥3.8
- Standard mathematical libraries (numpy, sympy auto-detected)

## Usage

```python
from py_sandbox import sandbox

# Secure mathematical computation
result = sandbox.evaluate("integrate(x**2, x)")
```

---
*Part of Φ-OS mathematical infrastructure*
