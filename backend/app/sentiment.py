from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    score = blob.sentiment.polarity
    if score > 0.1:
        label = 'positive'
    elif score < -0.1:
        label = 'negative'
    else:
        label = 'neutral'
    return score, label