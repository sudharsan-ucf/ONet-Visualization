import os
import json
import pandas as pd

# [Source] Cluster
clustersPath = os.path.join(os.pardir, 'data_ONet', 'db_careerCluster', 'All_Career_Clusters.csv')
clustersData = pd.read_csv(clustersPath)

# [Source] Jobs
occupationPath = os.path.join(os.pardir, 'data_ONet', 'db_26_1_text', 'Occupation Data.txt')
occupationData = pd.read_csv(occupationPath, sep = "\t")

# [Source] Skills
skillsPath = os.path.join(os.pardir, 'data_ONet', 'db_26_1_text', 'Skills.txt')
skillsData = pd.read_csv(skillsPath, sep = "\t")

# [Cluster] Assigning ID
clusterDictOutput = dict()
clusterDictOutput_Reverse = dict()
tmpListClusterNames = list(set(clustersData["Career Cluster"]))
tmpListClusterNames.sort()
clusterID = 0
for clusterName in tmpListClusterNames:
    clusterDictOutput[str(clusterID)] = dict()
    clusterDictOutput[str(clusterID)]['name'] = clusterName
    clusterDictOutput[str(clusterID)]['pathways'] = set()
    clusterDictOutput_Reverse[clusterName] = str(clusterID)
    clusterID += 1

# [Pathways] Assigning ID
pathwaysDictOutput = dict()
pathwaysDictOutput_Reverse = dict()
tmpListClusterPathways = list(set(clustersData["Career Pathway"]))
tmpListClusterPathways.sort()
pathwaysID = 0
for pathwaysName in tmpListClusterPathways:
    pathwaysDictOutput[str(pathwaysID)] = dict()
    pathwaysDictOutput[str(pathwaysID)]['name'] = pathwaysName
    pathwaysDictOutput[str(pathwaysID)]['jobs'] = set()
    pathwaysDictOutput_Reverse[pathwaysName] = str(pathwaysID)
    pathwaysID += 1

# [Occupations] Assigning ID
occupationsDictOutput = dict()
occupationsDictOutput_Reverse = dict()
for _, item in occupationData.transpose().to_dict().items():
    occupationsDictOutput[item['O*NET-SOC Code']] = dict()
    occupationsDictOutput[item['O*NET-SOC Code']]['name'] = item['Title']
    occupationsDictOutput_Reverse[item['Title']] = item['O*NET-SOC Code']

# [Skills] Assigning ID
skillsDictOutput = dict()
skillsDictOutput_Reverse = dict()
for skillID in list(set(skillsData['Element ID'])):
    skillName = list(set(skillsData[skillsData['Element ID']==skillID]['Element Name']))[0]
    skillsDictOutput[skillID] = skillName
    skillsDictOutput_Reverse[skillName] = skillID

# [Cluster] Assigning pathways
for _,value in clustersData.transpose().to_dict().items():
    clusterName = value['Career Cluster']
    clusterID = clusterDictOutput_Reverse[clusterName]
    pathwaysName = value['Career Pathway']
    pathwaysID = pathwaysDictOutput_Reverse[pathwaysName]
    jobCode = value['Code']
    jobName = value['Occupation']
    clusterDictOutput[clusterID]['pathways'].add(pathwaysID)

# [Pathways] Assigning jobs
for _,value in clustersData.transpose().to_dict().items():
    clusterName = value['Career Cluster']
    clusterID = clusterDictOutput_Reverse[clusterName]
    pathwaysName = value['Career Pathway']
    pathwaysID = pathwaysDictOutput_Reverse[pathwaysName]
    jobCode = value['Code']
    jobName = value['Occupation']
    pathwaysDictOutput[pathwaysID]['jobs'].add(jobCode)

# [Occupations] Assigning skills information
for item in skillsData.transpose().to_dict().values():
    dataValue = item['Data Value']
    occupationCode = item['O*NET-SOC Code']
    skillCode = item['Element ID']
    scaleType = item['Scale ID']
    if skillCode in occupationsDictOutput[occupationCode].keys():
        if scaleType == 'IM':
            occupationsDictOutput[occupationCode][skillCode][0] = dataValue
            occupationsDictOutput[occupationCode][skillCode].append(dataValue * occupationsDictOutput[occupationCode][skillCode][1])
        elif scaleType == 'LV':
            occupationsDictOutput[occupationCode][skillCode][1] = dataValue
            occupationsDictOutput[occupationCode][skillCode].append(dataValue * occupationsDictOutput[occupationCode][skillCode][0])
    else:
        if scaleType == 'IM':
            occupationsDictOutput[occupationCode][skillCode] = [dataValue, 0]
        elif scaleType == 'LV':
            occupationsDictOutput[occupationCode][skillCode] = [0, dataValue]

# [Occupations] Removing occupations with no skill information
popSet = set()
for occupation, value in occupationsDictOutput.items():
    if len(value.keys()) == 1:
        popSet.add(occupation)
for occupation in popSet:
    occupationsDictOutput.pop(occupation, None)

# [Occupations] Calculating weighted average for skills
for occupation, value in occupationsDictOutput.items():
    value['score'] = sum(value[sKey][2] for sKey in value.keys() if '.' in sKey)

# [Occupations] Dumping as JSON
occupationPathOutput = os.path.join(os.pardir, 'docs', 'data', 'occupationData.json')
with open(occupationPathOutput, 'w') as fh:
    json.dump(occupationsDictOutput, fh)

# [Pathways] Convering set to list
for value in pathwaysDictOutput.values():
    value['jobs'] = list(value['jobs'])

# [Pathways] Removing occupations with no skill information
popSet = set()
for pathway, pathwayObject in pathwaysDictOutput.items():
    removeList = list()
    for job in pathwayObject['jobs']:
        if job not in occupationsDictOutput.keys():
            removeList.append(job)
    for job in removeList:
        pathwayObject['jobs'].remove(job)
    if len(pathwayObject['jobs']) == 0:
        popSet.add(pathway)
for pathway in popSet:
    pathwaysDictOutput.pop(pathway, None)

# [Pathways] Dumping as JSON
pathwaysPathOutput = os.path.join(os.pardir, 'docs', 'data', 'pathwaysData.json')
with open(pathwaysPathOutput, 'w') as fh:
    json.dump(pathwaysDictOutput, fh)

# [Cluster] Convering set to list
for value in clusterDictOutput.values():
    value['pathways'] = list(value['pathways'])
    value['pathways'] = [int(x) for x in value['pathways']]
    value['pathways'].sort()
    value['pathways'] = [str(x) for x in value['pathways']]

# [Cluster] Removing clusters with no feasible pathway
popSet = set()
for cluster, clusterObject in clusterDictOutput.items():
    removeList = list()
    for pathway in clusterObject['pathways']:
        if pathway not in pathwaysDictOutput.keys():
            removeList.append(pathway)
    for pathway in removeList:
        clusterObject['pathways'].remove(pathway)
    if len(clusterObject['pathways']) == 0:
        popSet.add(cluster)
for cluster in popSet:
    clusterDictOutput.pop(cluster, None)

# [Cluster] Dumping as JSON
clusterPathOutput = os.path.join(os.pardir, 'docs', 'data', 'clusterData.json')
with open(clusterPathOutput, 'w') as fh:
    json.dump(clusterDictOutput, fh)

# [Skills] Dumping as JSON
skillsPathOutput = os.path.join(os.pardir, 'docs', 'data', 'skillsData.json')
with open(skillsPathOutput, 'w') as fh:
    json.dump(skillsDictOutput, fh)