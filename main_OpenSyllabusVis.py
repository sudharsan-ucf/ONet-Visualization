import gzip
import json
import os
import pandas as pd
import seaborn as sns
from matplotlib import pyplot as plt

desiredPhrases = [
    "broadening participation in STEM fields", "build an inclusive culture", "cross cultural studies", "cultural awareness", "cultural competency", 
    "cultural differences", "cultural diversity awareness", "cultural diversity", "cultural pluralism", "cultural representation",
    "culturally relevant education", "culture of diversity", "disabled persons", "disproportionate representation", "diverse organizations",
    "diverse sociodemographic groups", "diverse workforce", "diversity and inclusion best practices", "diversity and inclusion", "diversity at work",
    "diversity gap in STEM", "diversity in education", "diversity in STEM fields", "diversity in the work place", "diversity initiatives",
    "diversity management", "diversity training", "diversity", "educational equity", "equal education", "equality diversity and inclusion", "equity",
    "ethnic diversity", "ethnic variation", "ethnicity", "gender imbalance", "gender inclusivity", "gender issues", "heterogeneous cultural perspectives",
    "implicit bias", "inclusion", "inclusive science", "inclusivity", "institutional capacity for diversity and inclusion", "intentional inclusivity",
    "intercultural competence", "interpersonal relations", "managing diversity", "managing for diversity", "minority group students", "minority groups",
    "multiculturalism", "organizational diversity", "organizations inclusive climates", "participation of underrepresented minorities", "prejudice",
    "racial bias", "racial differences", "racial discrimination", "racial prejudices", "racial segregation", "racial stereotypes", "social bias",
    "strategies for inclusivity", "student diversity", "underrepresentation", "workforce diversity", "workplace diversity and inclusion", "workplace equity"]


def syllabusParser(jsonData):
    id = jsonData['id']
    syllabus_probability = jsonData['syllabus_probability']
    if 'field' in jsonData:
        fieldName = jsonData['field']['name']
    else:
        fieldName = ''
    if 'institution' in jsonData:
        institutionName = jsonData['institution']['name']
        institutionCountry = jsonData['institution']['country_code']
    else:
        institutionName = ''
        institutionCountry = ''
    description = ''
    learningOutcomes = ''
    topicOutline = ''
    if 'extracted_metadata' in jsonData:
        for tmpText in jsonData['extracted_metadata']['description']:
            description += tmpText['clean_text']
        for tmpText in jsonData['extracted_metadata']['learning_outcomes']:
            learningOutcomes += tmpText['clean_text']
        for tmpText in jsonData['extracted_metadata']['topic_outline']:
            topicOutline += tmpText['clean_text']

    return [id, fieldName, institutionName, institutionCountry, description, learningOutcomes, topicOutline]


folderPath = os.path.join(os.curdir, 'data_OpenSyllabus', 'syllabi.json')

FILELIMIT = 20
fileCounter = 0
# dataDict = dict()
dataList = list()
for fileName in os.listdir(folderPath):
    # dataCounter = 0
    if not fileName[-3:] == '.gz':
        pass
    with gzip.open(os.path.join(folderPath, fileName), 'r') as fh:
        jsonLines = fh.readlines()
        for jsonLine in jsonLines:
            jsonData = json.loads(jsonLine)
            parsedData = syllabusParser(jsonData)
            description, learningOutcomes, topicOutline = parsedData[3:6]
            combined = (description + learningOutcomes + topicOutline).lower()
            for phrase in desiredPhrases:
                parsedData.append(phrase in combined)
            dataList.append(parsedData)
        print(fileName, len(dataList))
    fileCounter += 1
    if fileCounter > FILELIMIT:
        break

dataDF = pd.DataFrame(dataList)


renamer = dict()
renamer[0] = 'ID'
renamer[1] = 'Field'
renamer[2] = 'Institution'
renamer[3] = 'Country'
renamer[4] = 'Description'
renamer[5] = 'Learning Outcomes'
renamer[6] = 'Topic Outline'
wordCounter = 7
for phrase in desiredPhrases:
    renamer[wordCounter] = phrase
    wordCounter += 1
dataDF = dataDF.rename(columns=renamer)

desiredFields = ['Engineering', 'Mathematics', 'Computer Science', 'Engineering Technician', 'Basic Computer Skills']

plotData = pd.melt(dataDF[dataDF.Field.isin(desiredFields)], id_vars = ['Field', 'Institution', 'Country'], value_vars=desiredPhrases, value_name='status', var_name='Phrase')



plotDataUS = plotData[plotData['Country'] == 'US'].groupby(['Field', 'Phrase']).sum().reset_index()

fig, ax = plt.subplots(figsize=(20,10))
_ = sns.lineplot(
    data = plotDataUS,
    x = "Phrase",
    y = "status",
    hue = "Field",
    ax = ax,
    dashes = True,
    markers = True
)

_ = plt.setp(ax.get_xticklabels(), ha="right", rotation=45)
ax.set_ylabel('Number of syllabi with the phrase')
ax.grid(True)
fig.tight_layout()
fig.savefig('plot_US.pdf', dpi=600)

print(len(dataList))



plotDataNUS = plotData[plotData['Country'] != 'US'].groupby(['Field', 'Phrase']).sum().reset_index()

fig, ax = plt.subplots(figsize=(20,10))
_ = sns.lineplot(
    data = plotDataNUS,
    x = "Phrase",
    y = "status",
    hue = "Field",
    ax = ax,
    dashes = True,
    markers = True
)

_ = plt.setp(ax.get_xticklabels(), ha="right", rotation=45)
ax.set_ylabel('Number of syllabi with the phrase')
ax.grid(True)
fig.tight_layout()
fig.savefig('plot_Non-US.pdf', dpi=600)

print(len(dataList))