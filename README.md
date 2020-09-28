# DietParselantro Widget

## Installation

`git clone` the repo locally

### Python packages

Install [Anaconda](https://docs.anaconda.com/anaconda/install/)

Install UMAP:
```bash
conda install umap-learn -c conda-forge
```

Verify that the environment defaults to python 3

### Javascript packages

```bash
npm install
```

### Setup

```bash
sh setup-develop.sh
sh update-develop.sh
```

## Usage

### Demo Notebook

*Note: We recommend using Jupyter in full screen mode when running DietParselantro. Widget may appear truncated otherwise.*

Open Jupyter Notebook:
```bash
jupyter notebook
```

Navigate to `notebooks/DietParselantro demo`

This file should run without errors

### Custom Usage

Load dataset from local filepath or url:
```python
import pandas as pd
df = pd.read_json(url)
df = pd.read_csv(url)
```

If necessary, rename text column to `clean_text`:
```python
df['clean_text'] = df['text variable'].str.lower()
```

Define { category : regex } pairs as a pandas Series. If no such pairs exist, simply define an empty dict:
```python
regex = pd.Series({"filter" : "filter",
         		   "cable" : "cable(s?)"})

# regex = {}
```

Hierarchical categories can be defined with a . separator:
```python
regex = pd.Series({"filter" : "filter",
         		   "cable" : "cable(s?)",
         		   "cable.piano accessories": "piano|keyboard|pedal"})
```

Generate embeddings for `clean_text`. Any embedding algorithm will work here, so long as the index order of the embeddings correspond to the rows in the dataframe.

Embeddings should be a pandas DataFrame. We provide a sample `get_embedding` function in the demo notebook:
```python
text = df.clean_text
embedding = pd.DataFrame(get_embedding(text), index=text.index)
```

Run DietParselantro:
```python
DietParselantro(data=df, regex=regex, embedding=embedding)
```