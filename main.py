import os
from google.appengine.ext.webapp import template
import cgi
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

nodes = {}
adj = {}
adj_arg = {}
i = 0
colors = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
def color(arg):
	
	global colors
	colored = {}
	for color in colors:
		colored[color] = []
	
	color = 0
	for node,neigh in arg.items():
		while 1:
			flag = 1
			a = sorted(neigh)
			for i in a:
				if i in colored[ colors[color] ]:
					color += 1
					flag = 0
					break
			if flag:
				colored[ colors[color] ].append(node)
				color = 0
				break
	return colored	


class MainHandler(webapp.RequestHandler):
	def get(self):
		template_values = {}
		path = os.path.join(os.path.dirname(__file__), 'main.html')
		self.response.out.write(template.render(path, template_values))
	def post(self):
		global values
		global i
		global adj
		global adj_arg
		d = [0, 0, 0]
		template_values = {}
		counter = 0
		res = cgi.escape(self.request.get(str(counter)))
		if res == 'create':
			counter += 1
			d[counter - 1] = int(cgi.escape(self.request.get(str(counter))))
			counter += 1
			d[counter - 1] = int(cgi.escape(self.request.get(str(counter))))
		elif res == 'select':
			a = int(cgi.escape(self.request.get(str(counter + 1))))
			b = int(cgi.escape(self.request.get(str(counter + 2))))
			try:
				if b not in adj[a]:
					adj[a].append(b)
				if b not in adj_arg[a]:
					adj_arg[a].append(b)
				if a not in adj_arg[b]:
					adj_arg[b].append(a)
			except KeyError:
				pass
		
		if res == 'create':
			nodes[i] = d
			adj[i] = []			# Initialize adjacency list
			adj_arg[i] = []		# Initialize adjacency list
			i += 1
		colr = color(adj_arg)
		template_values['cord'] = nodes
		template_values['adj'] = adj
		template_values['color'] = colr
		path = os.path.join(os.path.dirname(__file__), 'main.html')
		self.response.out.write(template.render(path, template_values))


def main():
    application = webapp.WSGIApplication([('/', MainHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
