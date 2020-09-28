npm install
npm run build -- --copy-files --no-demo
cd widget/js
npm install
npm run prepublish
cd ..
pip install -e .
cd ..
jupyter nbextension install --py --symlink --sys-prefix react_jupyter_widget_example
jupyter nbextension enable --py --sys-prefix react_jupyter_widget_example
