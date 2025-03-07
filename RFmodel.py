import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.metrics import roc_curve, auc
from sklearn.metrics import roc_auc_score
from sklearn.metrics import precision_recall_curve


fitness_df = pd.DataFrame()
for name in ['Lunge', 'Pullup']:
    df = pd.read_csv(f'./data/{name}.csv')
    df['Exercise'] = name
    fitness_df = pd.concat([fitness_df, df], axis=0, ignore_index=True)


from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, random_state=seed)
rf.fit(x_train, y_train)
y_pred_test = rf.predict(x_test)
y_pred_train = rf.predict(x_train)

print("Accuracy on test set: ", accuracy_score(y_test, y_pred_test))
print(classification_report(y_test, y_pred_test))
print("Accuracy on train set: ", accuracy_score(y_train, y_pred_train))
print(classification_report(y_train, y_pred_train))