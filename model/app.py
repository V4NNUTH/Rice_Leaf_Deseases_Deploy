from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
import logging

#app = flask.Flask(import_name="FlaskApp")
app = Flask(__name__)
CORS(app, resources={r"*":{"origins": "*"}})

# Load the model
MODEL_PATH = 'ownCNN_aug.weights.best.hdf5'
model = load_model(MODEL_PATH)

#Add the Labels list is difined elsewhere in your code
labels = ["Bacterial Leaf Blight", "Brown Spot", "Healthy", "Leaf Blast", "Narrow Brown"]

#Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)

def is_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpg', 'jpeg', 'png'}

@app.route('/',methods=['GET'])    
def index():
       
    return "Belong to Vannuth"


@app.route('/', methods=['POST'])
def predict():
    try:
        imagefile = request.files['imagefile']
        print(imagefile)
        if not imagefile:
            return jsonify({'error': 'No file provided'}), 400

        if not is_allowed_file(imagefile.filename):
            return jsonify({'error': 'Invalid file type'}), 400

        image_path = "./images/" + secure_filename(imagefile.filename)
        imagefile.save(image_path)

        # Adjust the target size to model input size
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Make a prediction
        y_hat = model.predict(img_array)
        pred_idx = np.argmax(y_hat[0])

        if 0 <= pred_idx < len(labels):
            # Get the predicted class label and probability
            predicted_label = labels[pred_idx]
            # Convert to percentage
            predicted_probability = y_hat[0][pred_idx] * 100

            # Log the prediction result
            logging.info('Predicted: %s (%.2f%%)', predicted_label, predicted_probability)

            # Prepare the response
            prediction = {
                'label': predicted_label,
                'probability': predicted_probability,
                #'Occurs' : disease_info.get('Occurs', ''),
                #'Identify': disease_info.get('Identify', ''),
                #'Manage': disease_info.get('Manage', '')
            }

            return jsonify(prediction)

        else:
            logging.warning('This disease is not in our system. We will train our system to detect it.')
            return jsonify({'error': 'Disease not recognized'}), 400

    except Exception as e:
        logging.error('An error occurred: %s', str(e))
        return jsonify({'error': 'An error occurred'}), 500     
        

# Add info of each diseases
disease_info = {
    "Bacterial Leaf Blight": {
        "Occurs": """The disease is most likely to develop in areas that have weeds and stubbles of infected plants. 
                    It can occur in both tropical and temperate environments, particularly in irrigated and rainfed lowland areas. 
                    In general, the disease favors temperatures at 25−34°C, with relative humidity above 70%.
                    
                    It is commonly observed when strong winds and continuous heavy rains occur, 
                    allowing the disease-causing bacteria to easily spread through ooze droplets on lesions of infected plants.
                        Bacterial blight can be severe in susceptible rice varieties under high nitrogen fertilization.""",
        "Identify": """-On seedlings, infected leaves turn grayish green and roll up. As the disease progresses, 
                    the leaves turn yellow to straw-colored and wilt, leading whole seedlings to dry up and die.
                    - On older plants, lesions usually develop as water-soaked to yellow-orange stripes on leaf blades or leaf tips or on mechanically injured parts of leaves. 
                    Lesions have a wavy margin and progress toward the leaf base.
                    - On young lesions, bacterial ooze resembling a milky dew drop can be observed early in the morning. 
                    The bacterial ooze later on dries up and becomes small yellowish beads underneath the leaf.
                    - Old lesions turn yellow to grayish white with black dots due to the growth of various saprophytic fungi. 
                    On severely infected leaves, lesions may extend to the leaf sheath.""",
        "Manage": """- Use balanced amounts of plant nutrients, especially nitrogen.
                     - Ensure good drainage of fields (in conventionally flooded crops) and nurseries.
                     - Keep fields clean. Remove weed hosts and plow under rice stubble, straw, rice ratoons and volunteer seedlings, which can serve as hosts of bacteria.
                     - Allow fallow fields to dry in order to suppress disease agents in the soil and plant residues."""
    },
    "Brown Spot": {
        "Occurs": """The disease can develop in areas with high relative humidity (86−100%) and temperature between 16 and 36°C.
                    It is common in unflooded and nutrient-deficient soil, or in soils that accumulate toxic substances.
                    
                      For infection to occur, the leaves must be wet for 8−24 hours.
                    The fungus can survive in the seed for more than four years and can spread from plant to plant through air. 
                    Major sources of brown spot in the field include:
                        +infected seed, which give rise to infected seedlings
                        +volunteer rice
                        +infected rice debris
                        +weeds """,
        "Identify": """-Infected seedlings have small, circular, yellow brown or brown lesions that may girdle the coleoptile and distort primary and secondary leaves.
                    - Starting at tillering stage, lesions can be observed on the leaves. 
                    They are initially small, circular, and dark brown to purple-brown.
                    - Fully developed lesions are circular to oval with a light brown to gray center, 
                    surrounded by a reddish brown margin caused by the toxin produced by the fungi.
                    - On susceptible varieties, lesions are 5−14 mm long which can cause leaves to wilt. 
                    On resistant varieties, the lesions are brown and pinhead-sized.
                    - In certain rice varieties, brown spot lesions can be mistaken for blast lesions. 
                    To confirm, check if spots are circular, brownish, and have a gray center surrounded by a reddish margin.""",
        "Manage": """- monitor soil nutrients regularly.
                     - apply required fertilizers
                     - for soils that are low in silicon, apply calcium silicate slag before planting
                     - Use resistant varieties.Contact your local agriculture office for up-to-date lists of varieties available. 
                     - Use fungicides (e.g., iprodione, propiconazole, azoxystrobin, trifloxystrobin, and carbendazim) as seed treatments.
                     - Treat seeds with hot water (53−54°C) for 10−12 minutes before planting, to control primary infection at the seedling stage. 
                    To increase effectiveness of treatment, pre-soak seeds in cold water for eight hours."""
    },
    "Healthy":  {
        "Occurs": """With good area have freesh enviroment.""",
        "Identify": """-Color: Healthy rice leaves are generally a vibrant green color. 
                    - Shape: Healthy rice leaves have a typical leaf shape that is characteristic of the rice plant. 
                    - Texture: The surface of healthy rice leaves should be smooth and free from any roughness, bumps, or raised areas.
                    - No Spots or Lesions: Healthy rice leaves should not have any visible spots, lesions, or blemishes. These can be signs of diseases or pest damage.
                    - Good Growth: Healthy rice leaves are part of a plant that exhibits vigorous and uniform growth. The plant should have a healthy root system and sturdy stems.""",
        "Manage": """- Proper Watering: Ensure that the rice plants receive adequate but not excessive water. Proper irrigation management can prevent water stress and diseases like bacterial leaf blight.
                    - Fertilization: Use appropriate fertilization practices to provide the rice plants with essential nutrients.
                    - Weed Control: Keep the rice field free from weeds, as they can compete with the rice plants for resources and create conditions conducive to disease development."""
    },
    "Leaf Blast": {
        "Occurs": """It occurs in areas with low soil moisture, frequent and prolonged periods of rain shower, and cool temperature in the daytime. In upland rice, 
                    large day-night temperature differences that cause dew formation on leaves and overall cooler temperatures favor the development of the disease.
                    Rice can have blast in all growth stages. However, 
                    leaf blast incidence tends to lessen as plants mature and develop adult plant resistance to the disease.""",
        "Identify": """-Initial symptoms appear as white to gray-green lesions or spots, with dark green borders.
                    - Older lesions on the leaves are elliptical or spindle-shaped and whitish to gray centers with red to brownish or necrotic border.
                    - Some resemble diamond shape, wide in the center and pointed toward either ends.
                    - Lesions can enlarge and coalesce, growing together, to kill the entire leaves.""",
        "Manage": """- Adjust planting time. Sow seeds early, when possible, after the onset of the rainy season.
                    - Split nitrogen fertilizer application in two or more treatments. Excessive use of fertilizer can increase blast intensity.
                    - Flood the field as often as possible."""
    },
    "Narrow Brown": {
        "Occurs": """- The disease usually occurs in potassium deficient soils, and in areas with temperature ranging from 25−28°C. 
                   - It appears during the late growth stages of the rice crop, starting at heading stage.
                   - Plants are most susceptible during panicle initiation onwards, and damage becomes more severe as plants approach maturity. """,
        "Identify": """-Typical lesions on leaves and upper leaf sheath are light to dark brown, linear, and progress parallel to the vein. They are usually 2−10 mm long and 1−1.5 mm wide.
                    - Lesions on the leaves of highly susceptible varieties may enlarge and connect together, forming brown linear necrotic regions.
                    - On glumes, lesions are usually shorter but can be wider than those on the leaves. Brown lesions are also found on pedicels.
                    - The disease also causes discoloration on the leaf sheath, referred to as “net blotch” because of the netlike pattern of brown and light brown to yellow areas.
                    """,
        "Manage": """- Use resistant varieties. Contact your local agriculture office for up-to-date lists of varieties available.
                    - Keep fields clean. 
                    - Remove weeds and weedy rice in the field and nearby areas to remove alternate hosts that allow the fungus to survive and infect new rice crops.
                    - Use balanced nutrients; make sure that adequate potassium is used.
                    - If narrow brown spot poses a risk to the field, spray propiconazole at booting to heading stages."""
    },
}
# Endpoint to fetch disease information
# The frontend should handle the returned disease information accordingly.
@app.route('/get_disease_info/<disease_name>', methods=['GET'])
def get_disease_info(disease_name):
    info = disease_info.get(disease_name)
    if not info:
        return jsonify({'error': 'Disease not found'}), 404
    return jsonify(info)
  
    
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
